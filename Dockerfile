# Base image for Node.js 14 with Ubuntu Bionic for compatibility
FROM node:14-bionic AS base

# Set the working directory
WORKDIR /app

# Set non-interactive mode for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install common dependencies
RUN apt-get update && \
    apt-get install -y \
    libfontconfig1 \
    libcairo2 \
    libjpeg-turbo8 \
    wget \
    build-essential \
    git \
    cmake \
    libfreetype6-dev \
    libpng-dev \
    libpoppler-cpp-dev \
    poppler-utils \
    libspdlog-dev \
    && apt-get clean

# Use multi-stage build to handle multi-platform installations
FROM base AS builder

# Set an argument for the target architecture
ARG TARGETARCH

# Install pdf2htmlEX based on the target architecture
RUN if [ "$TARGETARCH" = "amd64" ]; then \
    wget https://github.com/pdf2htmlEX/pdf2htmlEX/releases/download/v0.18.8.rc1/pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb && \
    dpkg -i pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb && \
    rm pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb; \
    else \
    git clone https://github.com/pdf2htmlEX/pdf2htmlEX.git && \
    cd pdf2htmlEX && \
    cmake . && make && make install && \
    cd .. && rm -rf pdf2htmlEX; \
    fi

# Install Node.js dependencies separately to leverage Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Final stage to create a smaller image
FROM node:14-bionic AS final

# Set the working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app /app

# Expose the port your app runs on
EXPOSE 8000

# Command to run your app
CMD ["node", "dist/app.js"]
