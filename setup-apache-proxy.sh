#!/bin/bash

echo "Setting up Apache reverse proxy for Node.js app..."

# Disable các VirtualHost mặc định của Bitnami
echo "Disabling default Bitnami vhosts..."
cd /opt/bitnami/apache/conf/vhosts/
for f in *.conf; do
    if [ "$f" != "nodejs-app.conf" ]; then
        sudo mv "$f" "$f.disabled" 2>/dev/null || true
    fi
done

# Xóa file cũ nếu tồn tại
if [ -f /opt/bitnami/apache/conf/vhosts/nodejs-app.conf ]; then
    echo "Removing old config..."
    sudo rm /opt/bitnami/apache/conf/vhosts/nodejs-app.conf
fi

# Tạo file config mới
sudo tee /opt/bitnami/apache/conf/vhosts/nodejs-app.conf > /dev/null <<'EOF'
<VirtualHost *:443>
    ServerName 3.1.255.150
    
    SSLEngine on
    SSLCertificateFile "/opt/bitnami/apache/conf/bitnami/certs/tls.crt"
    SSLCertificateKeyFile "/opt/bitnami/apache/conf/bitnami/certs/tls.key"
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>

<VirtualHost *:80>
    ServerName 3.1.255.150
    Redirect permanent / https://3.1.255.150/
</VirtualHost>
EOF

# Test config
echo "Testing Apache config..."
sudo /opt/bitnami/apache/bin/apachectl configtest

# Restart Apache
echo "Restarting Apache..."
sudo /opt/bitnami/ctlscript.sh restart apache

echo "Done! Access https://3.1.255.150"
