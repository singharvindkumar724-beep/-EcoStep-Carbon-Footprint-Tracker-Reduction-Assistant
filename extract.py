import zipfile
import xml.etree.ElementTree as ET
import os
import glob

def docx_to_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in root.findall('.//w:p', namespaces):
                texts = []
                for t in p.findall('.//w:t', namespaces):
                    if t.text:
                        texts.append(t.text)
                paragraphs.append("".join(texts))
            return "\n".join(paragraphs)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

project_dir = "."
for docx_file in glob.glob("*.docx"):
    print(f"Reading: {docx_file}")
    text = docx_to_text(docx_file)
    txt_filename = docx_file + ".txt"
    with open(txt_filename, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved to: {txt_filename}")
