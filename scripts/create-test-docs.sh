#!/bin/bash

mkdir -p test-files
cd test-files

echo "Creating test PDF..."
echo "Test PDF file" | pandoc -o test.pdf 2>/dev/null || echo "PDF placeholder" > test.pdf

echo "Creating test DOC..."
echo "Test DOC file" > test.doc

echo "Creating test DOCX..."
echo "Test DOCX file" | pandoc -o test.docx 2>/dev/null || echo "DOCX placeholder" > test.docx

echo "Creating test PNG..."
convert -size 800x600 xc:skyblue test.png 2>/dev/null || echo "PNG placeholder" > test.png

echo "Creating test JPG..."
convert -size 800x600 xc:salmon test.jpg 2>/dev/null || echo "JPG placeholder" > test.jpg

echo "Done. Files created in ./test-files"
