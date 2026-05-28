---
title: "SSH Key Generation"
description: "How to setup ssh key pair"
date: "Jan 18 2026"
---

# Creating ssh key pair

## Step 1 - Generating SSH Key Pair
On your local machine generate ssh key pair using:
```bash
ssh-keygen 
``` 
To select an algorithm using -t and for selecting key size use -b
```bash
ssh-keygen -t rsa -b 4096
```
or
```bash
ssh-keygen -t dsa 
```
or 
```bash
ssh-keygen -t ecdsa -b 521
```
or
```bash
ssh-keygen -t ed25519
```

Now choose a name for your key or leave it as is its up to you

## Step 2 - Copying Public SSH key to the server
To copy the public key to your server you can run the follwoing cmd

```bash
cat ~/.ssh/{key_name}.pub | ssh username@remote_host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Now you are all setup you can now access your server noramlly without a password

## (Optional) Step 3 - Disabling Password Authentication
This step will let you disbale password authentication so you wont be able to access the server using user and password you will have to have an SSH key pair.

Before disablining password auth make sure that the user you login with has root privilidge **sudo**

Edit *sshd_config* file using your fav text editor
```bash
sudo vim /etc/ssh/sshd_config
``` 
Then search for *PasswordAuthentication*
```vim
PasswordAuthentication = no
```
Save and close the file then restart the service
```bash
sudo systemctl restart ssh
```

## Additional Step: Configuring SSH alias
This will make you use an alias for you server connection you wont have to connect using username and IP address of your server you just need to remember the name you gave the server 

First edit your ssh config file on your local machine
```bash
vim ~/.ssh/config
```

Then add you ssh alias 
```vim
Host serverName
    HostName <ip_address>
    User <username>
    IdentityFile <~/.ssh/{private_key}>
``` 
Save and exit the file 

You can add multiple hosts in this file


### For more info check out this [link](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)
