# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Production Stage ────────────────────────────────────────────────────────
FROM nginx:stable-alpine
# Copy built files into Nginx’s html folder
COPY --from=builder /app/build /usr/share/nginx/html

# (Optional) if you need client-side routing, add a custom nginx.conf here:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
