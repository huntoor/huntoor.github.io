---
title: "Pi-Hole Setup"
description: "How I setup my Pi-Hole"
date: "Jan 18 2026"
---

# How to setup Pi-Hole using docker compose
I will be adding Pi-hole in a docker contianer in the same server as the Obsidian Sync DB.

This Pi-Hole will act as my network DNS & DHCP

## Setting up Docker Compose
using the help from [this doc.](https://docs.pi-hole.net/docker/)

First copy the below to a `docker-compose.yml` file.
```yaml
# More info at https://github.com/pi-hole/docker-pi-hole/ and https://docs.pi-hole.net/
services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    network_mode: "host"
    ports:
      # DNS Ports
      - "53:53/tcp"
      - "53:53/udp"
      # Default HTTP Port
      - "80:80/tcp"
      # Default HTTPs Port. FTL will generate a self-signed certificate
      - "443:443/tcp"
      # Uncomment the below if using Pi-hole as your DHCP Server
      "67:67/udp"
      # Uncomment the line below if you are using Pi-hole as your NTP server
      #- "123:123/udp"
    environment:
      # Set the appropriate timezone for your location from
      # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones, e.g:
      TZ: 'Africa/Cairo'
      # Set a password to access the web interface. Not setting one will result in a random password being assigned
      FTLCONF_webserver_api_password: 'Super Secret password that you 100% wont be able to guess'
      # If using Docker's default `bridge` network setting the dns listening mode should be set to 'ALL'
      FTLCONF_dns_listeningMode: 'ALL'
    # Volumes store your data between container upgrades
    volumes:
      # For persisting Pi-hole's databases and common configuration file
      - './etc-pihole:/etc/pihole'
      # Uncomment the below if you have custom dnsmasq config files that you want to persist. Not needed for most starting fresh with Pi-hole v6. If you're upgrading from v5 you and have used this directory before, you should keep it enabled for the first v6 container start to allow for a complete migration. It can be removed afterwards. Needs environment variable FTLCONF_misc_etc_dnsmasq_d: 'true'
      #- './etc-dnsmasq.d:/etc/dnsmasq.d'
    cap_add:
      # See https://github.com/pi-hole/docker-pi-hole#note-on-capabilities
      # Required if you are using Pi-hole as your DHCP server, else not needed
      - NET_ADMIN
      # Required if you are using Pi-hole as your NTP client to be able to set the host's system time
      # - SYS_TIME
      # Optional, if Pi-hole should get some more processing time
      - SYS_NICE
    restart: unless-stopped
```
After it run the follwing cmd to build and start pi-hole:
```bash
docker compose up -d 
```
### Issues I saw
*There is an issue that I got where docker didnt want to start cuz there is a service listing on port 53 it was ``systemd-resolved``*
To solve this I stopped the service and deleted the link between `/etc/resolv.conf` and `/etc/systemd/resolved.conf`

I just added this line in my new `resolv.conf` file
```
nameserver 127.0.0.1
```
## Navigate to Pi-Hole
Go to **http://<server_ip>/admin/login** and enjoy your pi-hole :)