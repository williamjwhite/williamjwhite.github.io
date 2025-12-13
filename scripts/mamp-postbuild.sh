#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/dist"

cat > "${DIST_DIR}/.htaccess" <<'HTACCESS'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule ^ index.html [L]
</IfModule>
HTACCESS

echo "✅ Wrote ${DIST_DIR}/.htaccess"
