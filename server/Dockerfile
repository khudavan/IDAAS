# Use the official AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY ./server/package*.json ./
RUN npm ci --only=production

# Copy the rest of the application code
COPY ./server .

# Specify the command to run the application (your entrypoint file)
CMD ["app.handler"]