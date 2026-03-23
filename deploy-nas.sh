#!/usr/bin/env bash

# 시놀로지 NAS 로그인 정보 (.ssh/config 설정값)
NAS_IP="172.30.1.85"
TARGET_DIR="/volume1/docker/sns-project"

echo "🚀 Starting Deployment to NAS (172.30.1.85)..."
echo "📁 Cleaning & Verifying remote directory..."
ssh -p 8096 duang96@$NAS_IP "rm -rf $TARGET_DIR/src && mkdir -p $TARGET_DIR"

# 극단적인 SCP/Rsync 차단 회피: tar ssh stream
echo "📦 Compress & Stream: Transferring code via encrypted SSH tunnel..."
tar --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    --exclude=deploy-nas.sh \
    --exclude=.DS_Store \
    -czf - . | ssh -p 8096 duang96@$NAS_IP "cd $TARGET_DIR && tar -xzf -"

if [ $? -ne 0 ]; then
    echo "❌ File transfer failed!"
    exit 1
fi
echo "✅ Transfer OK."

# .env.local 파일에서 안전하게 비밀번호를 불러옵니다. (Github 노출 방지)
NAS_PASS=$(grep '^NAS_PASSWORD=' .env.local | cut -d '"' -f2)

# Docker 구동 (비밀번호를 파이프라인으로 전송하여 완전 자동화)
echo "🐳 Rebuilding Docker container on NAS..."
ssh -p 8096 duang96@$NAS_IP "cd $TARGET_DIR && \
export PATH=\$PATH:/usr/local/bin:/usr/bin:/bin:/var/packages/Docker/target/usr/bin && \
if command -v docker-compose >/dev/null 2>&1; then \
  echo '$NAS_PASS' | sudo -S docker-compose up -d --build web; \
elif command -v docker compose >/dev/null 2>&1; then \
  echo '$NAS_PASS' | sudo -S docker compose up -d --build web; \
elif [ -f /usr/local/bin/docker-compose ]; then \
  echo '$NAS_PASS' | sudo -S /usr/local/bin/docker-compose up -d --build web; \
else \
  echo '❌ Docker compose command not found in common paths. Please check NAS docker installation.'; \
fi"

echo "🎉 Deployment Process Finished! Visit http://172.30.1.85:3001"
