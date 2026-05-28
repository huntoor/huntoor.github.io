---
title: "Obsidian Sync Setup"
description: "How I self hosted my notes using Obsidian LiveSync"
date: "Jan 01 2026"
---

# Obsidian Sync Server

You can skip my shitty doc and follow this [tutorial](https://www.youtube.com/watch?v=Pukp9nKozE8&list=RDu2ah9tWTkmk&index=2) its much more neat than mine trust me :)

For my setup I will be using CouchDB for real-time sync, and Twingate for remote access.

## Step 1: Installing Docker
### On your Ubuntu Server
``` bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
docker --version
docker compose version
```

## Setp 2: Setting up CouchDB using Docker
I followed [this guide](https://github.com/apache/couchdb-docker)

Create an CouchDB instance
```bash
docker run -d --name my-couchdb -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=mySuperSecureP@ssword69420haHA -v ./couchdb-data:/opt/couchdb/data couchdb:latest
```
Exposing CouchDB to the outside world
```bash
docker run -p 5984:5984 -d couchdb
```
Now try accessing ***http://<server_ip>:5984***

## Step 3: Configuring CouchDB
- First open ***http://<server_ip>:5984/_utils***
- Login using the credentials configured
- Create a new Database named `obsidian`
- Add a user with read & write permissions

## Step 4: Setting up Twingate for Remote Access
How to deploy new connector in Twingate [here](https://www.twingate.com/docs/connectors-on-linux)

You just need to add a connector to your server and you are all setup

## Step 5: Installing Obsidian LiveSync
***Note: This is a temp setup untill I buy myself a domain***

First install **Self-Hosted LiveSync** plugin:
- Settings → Community plugins → Browse → Search “Self-hosted LiveSync” → Install → Enable

Now configure the plugin with
1. Enable LiveSync
2. Choose ***I am setting this up for the first time*** then next
3. Click ***Enter ther server info manually***
4. If you want check `Encrypt you data`
5. Next choose ***CouchDB***
6. Now add your URL eg.`http://<server_ip>:5984`(you should have an https connection try to figure it out XD)
7. Add `Username` and `Password` that you setup in for the CouchDB
8. Add your `Database Name`
9. Enable `Using Internal API` (IDK why XD)
10. Now check all and next next next next till it works 

Now you are all setup enjoy.
