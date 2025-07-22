import os
import re
import glob
from pathlib import Path
from typing import Dict, List, Tuple, Set
import argparse

def generate_docusaurus_anchor_id(heading_text: str) -> str:
    """
    Generate anchor ID following Docusaurus rules.
    
    Docusaurus anchor ID generation:
    1. Convert to lowercase
    2. Replace spaces and special chars with hyphens
    3. Remove multiple consecutive hyphens
    4. Remove leading/trailing hyphens
    5. Remove certain special characters entirely
    """
    # Remove markdown formatting (bold, italic, code, etc.)
    clean_text = re.sub(r'[*_`~]', '', heading_text)
    
    # Convert to lowercase
    anchor_id = clean_text.lower()
    
    # Replace spaces, dots, parentheses, and other special chars with hyphens
    anchor_id = re.sub(r'[\s\.\(\)\[\]\{\}\/\\:;,\'"!@#$%^&*+=<>?|]', '-', anchor_id)
    
    # Remove multiple consecutive hyphens
    anchor_id = re.sub(r'-+', '-', anchor_id)
    
    # Remove leading and trailing hyphens
    anchor_id = anchor_id.strip('-')
    
    return anchor_id

def extract_headings_from_content(content: str, file_path: str) -> Dict[str, str]:
    """
    Extract all headings from MDX content and generate their anchor IDs.
    
    Returns:
        Dict mapping original heading text to generated anchor ID
    """
    headings = {}
    
    # Find all markdown headings (# ## ### etc.)
    heading_pattern = r'^(#{1,6})\s+(.+)$'
    
    for line_num, line in enumerate(content.split('\n'), 1):
        match = re.match(heading_pattern, line.strip())
        if match:
            level = len(match.group(1))  # Number of # symbols
            heading_text = match.group(2).strip()
            
            # Generate anchor ID
            anchor_id = generate_docusaurus_anchor_id(heading_text)
            
            if anchor_id:  # Only add non-empty anchor IDs
                headings[heading_text] = anchor_id
                print(f"[DEBUG] {file_path}:{line_num} - Found heading: '{heading_text}' -> #{anchor_id}")
    
    return headings

def find_internal_links_with_anchors(content: str) -> List[Tuple[str, str, str]]:
    """
    Find all internal markdown links that include anchors.
    
    Returns:
        List of tuples: (full_match, link_text, url_with_anchor)
    """
    links = []
    
    # Pattern to match markdown links with anchors: [text](file#anchor) or [text](#anchor)
    link_pattern = r'\[([^\]]*)\]\(([^)]*#[^)]*)\)'
    
    for match in re.finditer(link_pattern, content):
        full_match = match.group(0)
        link_text = match.group(1)
        url_with_anchor = match.group(2)
        
        # Only process internal links (not external URLs)
        if not url_with_anchor.startswith(('http://', 'https://', 'mailto:')):
            links.append((full_match, link_text, url_with_anchor))
    
    # Also look for standalone anchor links in the format: file#anchor (without brackets)
    # This catches cases where links might be referenced in other ways
    standalone_pattern = r'(?<!\[)\b([a-zA-Z0-9_/-]+(?:\.mdx?)?#[a-zA-Z0-9_-]+)\b(?!\])'
    
    for match in re.finditer(standalone_pattern, content):
        url_with_anchor = match.group(1)
        # Skip if it's already part of a markdown link or if it's an external URL
        if not url_with_anchor.startswith(('http://', 'https://', 'mailto:')):
            # Check if this isn't already captured as part of a markdown link
            start_pos = match.start()
            # Look backward to see if this is part of a markdown link
            preceding_text = content[max(0, start_pos-50):start_pos]
            if not re.search(r'\[[^\]]*\]\([^)]*$', preceding_text):
                links.append((url_with_anchor, '', url_with_anchor))
    
    return links

def fix_anchor_in_url(url_with_anchor: str, all_headings: Dict[str, Dict[str, str]], current_file: str) -> str:
    """
    Fix the anchor part of a URL to match actual heading IDs.
    
    Args:
        url_with_anchor: URL like "file#anchor" or "#anchor"
        all_headings: Dict mapping file paths to their heading mappings
        current_file: Current file being processed (for same-page anchors)
    
    Returns:
        Fixed URL with correct anchor ID
    """
    if '#' not in url_with_anchor:
        return url_with_anchor
    
    # Split URL and anchor
    if url_with_anchor.startswith('#'):
        # Same-page anchor: #anchor
        file_part = ''
        anchor_part = url_with_anchor[1:]  # Remove #
        target_file = current_file
    else:
        # Cross-page anchor: file#anchor
        file_part, anchor_part = url_with_anchor.split('#', 1)
        
        # Clean up anchor part - remove any extra content like quotes or "mention"
        if ' ' in anchor_part:
            anchor_part = anchor_part.split(' ')[0]
        if '"' in anchor_part:
            anchor_part = anchor_part.split('"')[0]
        
        # Determine target file path
        if file_part.endswith('.mdx'):
            target_file = file_part
        elif file_part.endswith('.md'):
            target_file = file_part[:-3] + '.mdx'  # Convert .md to .mdx
        else:
            target_file = file_part + '.mdx'  # Assume .mdx extension
    
    # Find the target file's headings
    target_headings = None
    for file_path, headings in all_headings.items():
        # Match by filename (handle relative paths)
        if file_path.endswith(target_file) or os.path.basename(file_path) == os.path.basename(target_file):
            target_headings = headings
            break
        # Handle relative paths like "advanced/object-ids.mdx"
        if target_file.replace('/', os.sep) in file_path.replace('/', os.sep):
            target_headings = headings
            break
        # Handle paths without extensions
        if target_file.endswith('.mdx') and file_path.endswith(target_file):
            target_headings = headings
            break
    
    if not target_headings:
        print(f"[WARNING] Could not find headings for target file: {target_file}")
        return url_with_anchor
    
    # Try to find matching heading
    original_anchor = anchor_part
    
    # First, try exact match with generated anchor ID
    if original_anchor in target_headings.values():
        # Already correct
        return url_with_anchor
    
    # Define specific anchor mappings for known broken anchors
    anchor_mappings = {
        # Advanced setup anchors
        'objectbox-for-java-advanced-setup': 'objectbox-for-java-advanced-setup',
        'objectbox-for-flutter-dart-advanced-setup': 'objectbox-for-flutter-dart-advanced-setup',
        
        # Data observers anchors  
        'objectbox-for-java-data-observers-and-reactive-extensions': 'objectbox-java-data-observers-and-reactive-extensions',
        'objectbox-java-data-observers-and-reactive-extensions': 'objectbox-java-data-observers-and-reactive-extensions',
        
        # Flutter/Dart anchors
        'flutter-dart': 'flutter-dart',
        'objectbox-dart-reactive-queries-a-href-flutter-dart-id-flutter-dart-a': 'flutter-dart',
        
        # Object IDs anchors
        'self-assigned-object-ids': 'manually-assigned-object-ids',
        
        # Query API anchors (these sections don't exist in current docs)
        'new-query-api-java-kotlin-3.0': None,
        'new-query-api': None,
        'aggregating-values': None,
        'add-query-conditions-for-related-entities-links': None,
        'reusing-queries-and-parameters': None,
        
        # Relations anchors
        'one-to-many-1-n': 'one-to-many-1n',
        'many-to-many-n-m': 'many-to-many-nm',
        
        # Desktop apps anchors
        'objectbox-embedded-database-for-java-desktop-apps': 'objectbox-embedded-database-for-java-desktop-apps',
        'objectbox-%E2%80%93-embedded-database-for-java-desktop-apps': 'objectbox-embedded-database-for-java-desktop-apps',
        
        # Android components anchors
        'objectbox-livedata-with-android-architecture-components': 'objectbox-livedata-with-android-architecture-components',
        
        # Getting started anchors
        'adding-objectbox-to-your-android-project': 'add-objectbox-to-your-project',
        'core-initialization': 'create-a-store',
        
        # C++ specific anchors
        'cmake-support': 'cmake-integration',
        'cmake-3.14': 'objectbox-library',
        'reset-data-new-uid-on-a-property': 'reset-data-new-uid-on-a-property',
        'standalone': 'using-the-standalone-generator',
    }
    
    # Try specific mappings first
    if original_anchor in anchor_mappings:
        mapped_anchor = anchor_mappings[original_anchor]
        if mapped_anchor is None:
            print(f"[WARNING] Anchor '{original_anchor}' references non-existent section - should be removed")
            return url_with_anchor
        elif mapped_anchor in target_headings.values():
            if file_part:
                fixed_url = f"{file_part}#{mapped_anchor}"
            else:
                fixed_url = f"#{mapped_anchor}"
            print(f"[FIX] Updated anchor: {url_with_anchor} -> {fixed_url}")
            return fixed_url
    
    # Try to find heading text that matches the anchor
    best_match = None
    best_score = 0
    
    for heading_text, correct_anchor_id in target_headings.items():
        # Try various matching strategies
        
        # 1. Direct text match (convert heading to anchor-like format)
        heading_as_anchor = generate_docusaurus_anchor_id(heading_text)
        if heading_as_anchor == original_anchor:
            best_match = correct_anchor_id
            break
        
        # 2. Fuzzy matching - check if original anchor is similar to heading text
        heading_words = heading_text.lower().split()
        anchor_words = original_anchor.replace('-', ' ').split()
        
        # Count matching words
        matching_words = sum(1 for word in anchor_words if any(word in hw for hw in heading_words))
        score = matching_words / max(len(anchor_words), 1)
        
        if score > best_score and score > 0.5:  # At least 50% word match
            best_match = correct_anchor_id
            best_score = score
    
    if best_match:
        if file_part:
            fixed_url = f"{file_part}#{best_match}"
        else:
            fixed_url = f"#{best_match}"
        
        print(f"[FIX] Updated anchor: {url_with_anchor} -> {fixed_url}")
        return fixed_url
    else:
        print(f"[WARNING] Could not find matching heading for anchor: {original_anchor} in {target_file}")
        return url_with_anchor

def process_mdx_file(file_path: str, all_headings: Dict[str, Dict[str, str]], dry_run: bool = False) -> bool:
    """
    Process a single MDX file to fix anchor links.
    
    Returns:
        True if file was modified, False otherwise
    """
    print(f"\n[INFO] Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"[ERROR] Could not read {file_path}: {e}")
        return False
    
    # Find all internal links with anchors
    links = find_internal_links_with_anchors(content)
    
    if not links:
        print(f"[INFO] No internal anchor links found in {file_path}")
        return False
    
    print(f"[INFO] Found {len(links)} internal anchor links")
    
    # Debug: Show all found links
    for i, (full_match, link_text, url_with_anchor) in enumerate(links):
        print(f"[DEBUG] Link {i+1}: '{full_match}' -> URL: '{url_with_anchor}'")
    
    # Fix each link
    modified_content = content
    changes_made = False
    
    for full_match, link_text, url_with_anchor in links:
        print(f"[DEBUG] Checking link: [{link_text}]({url_with_anchor})")
        
        fixed_url = fix_anchor_in_url(url_with_anchor, all_headings, os.path.basename(file_path))
        
        if fixed_url != url_with_anchor:
            # Replace the link in content
            fixed_link = f"[{link_text}]({fixed_url})"
            modified_content = modified_content.replace(full_match, fixed_link, 1)
            changes_made = True
            print(f"[FIX] {full_match} -> {fixed_link}")
    
    # Write back if changes were made and not in dry-run mode
    if changes_made and not dry_run:
        # Write modified content directly
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            print(f"[SUCCESS] Updated {file_path}")
        except Exception as e:
            print(f"[ERROR] Could not write {file_path}: {e}")
            return False
    elif changes_made and dry_run:
        print(f"[DRY-RUN] Would update {file_path}")
    
    return changes_made

def find_mdx_files(directory: str) -> List[str]:
    """Find all MDX files in the given directory recursively."""
    mdx_files = []
    
    # Use glob to find all .mdx files recursively
    pattern = os.path.join(directory, '**', '*.mdx')
    for file_path in glob.glob(pattern, recursive=True):
        # Skip node_modules and other common directories
        if not any(skip in file_path for skip in ['node_modules', '.git', 'build', 'dist']):
            mdx_files.append(file_path)
    
    return sorted(mdx_files)

def main():
    parser = argparse.ArgumentParser(description='Fix broken anchor links in Docusaurus MDX files')
    parser.add_argument('directory', nargs='?', default='.', help='Directory to scan for MDX files (default: current directory)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without making actual changes')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    
    args = parser.parse_args()
    
    directory = os.path.abspath(args.directory)
    
    if not os.path.isdir(directory):
        print(f"[ERROR] Directory not found: {directory}")
        return 1
    
    print(f"[INFO] Scanning for MDX files in: {directory}")
    
    # Find all MDX files
    mdx_files = find_mdx_files(directory)
    
    if not mdx_files:
        print("[INFO] No MDX files found")
        return 0
    
    print(f"[INFO] Found {len(mdx_files)} MDX files")
    
    # First pass: Extract all headings from all files
    print("\n[INFO] Extracting headings from all files...")
    all_headings = {}
    
    for file_path in mdx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            headings = extract_headings_from_content(content, file_path)
            if headings:
                all_headings[file_path] = headings
                print(f"[INFO] {file_path}: {len(headings)} headings")
        except Exception as e:
            print(f"[ERROR] Could not process {file_path}: {e}")
            continue
    
    print(f"\n[INFO] Total headings extracted: {sum(len(h) for h in all_headings.values())}")
    
    # Second pass: Fix anchor links in all files
    print("\n[INFO] Fixing anchor links...")
    
    total_modified = 0
    for file_path in mdx_files:
        if process_mdx_file(file_path, all_headings, args.dry_run):
            total_modified += 1
    
    print(f"\n[SUMMARY] Processed {len(mdx_files)} files")
    if args.dry_run:
        print(f"[SUMMARY] Would modify {total_modified} files")
    else:
        print(f"[SUMMARY] Modified {total_modified} files")
    
    return 0

if __name__ == '__main__':
    exit(main())
