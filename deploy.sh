#!/bin/bash

# Function to print rockets
print_rockets() {
  while :; do
    echo -ne "🚀🚀🚀 Deploying to PRODUCTION server APOLLO 🚀🚀🚀\r"
    sleep 0.5
  done
}

# Start the rockets in the background
print_rockets &
ROCKETS_PID=$!

# Cargar variables de entorno desde el archivo .env
source .env

echo "Building Docker image..."
docker build -t $DOCKER_IMAGE .

echo "Saving Docker image and loading on the server..."
docker save $DOCKER_IMAGE | ssh $SERVER_USER@$SERVER_IP "docker load"

# Detener y eliminar cualquier contenedor existente que use la misma imagen
ssh $SERVER_USER@$SERVER_IP << EOF
docker ps -q --filter "ancestor=$DOCKER_IMAGE" | grep -q . && docker stop \$(docker ps -q --filter "ancestor=$DOCKER_IMAGE") && docker rm \$(docker ps -q --filter "ancestor=$DOCKER_IMAGE")
EOF

# Asegurarse de que los puertos 80 y 443 estén libres antes de iniciar el nuevo contenedor
ssh $SERVER_USER@$SERVER_IP << EOF
docker ps -q --filter "publish=80" | grep -q . && docker stop \$(docker ps -q --filter "publish=80") && docker rm \$(docker ps -q --filter "publish=80")
docker ps -q --filter "publish=443" | grep -q . && docker stop \$(docker ps -q --filter "publish=443") && docker rm \$(docker ps -q --filter "publish=443")
EOF

# Iniciar un nuevo contenedor
ssh $SERVER_USER@$SERVER_IP "docker run -d --restart unless-stopped -p 80:80 -p 443:443 $DOCKER_IMAGE"

# Reiniciar Nginx si es necesario
ssh $SERVER_USER@$SERVER_IP "sudo systemctl restart nginx"

# Stop the rockets animation
kill $ROCKETS_PID

echo "🚀🚀🚀 Deployment to PRODUCTION server APOLLO completed successfully! 🚀🚀🚀"
