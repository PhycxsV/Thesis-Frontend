#!/bin/bash

echo "Installing Water Allocation Monitoring System..."
echo

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error installing dependencies!"
    exit 1
fi

echo
echo "Installation completed successfully!"
echo
echo "To start the application, run: npm start"
echo






