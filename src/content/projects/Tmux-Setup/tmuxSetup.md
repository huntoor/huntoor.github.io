---
title: "My Tmux setup and config"
description: "How I setup and configured tmux for myslef"
date: "May 21 2026"
---

# My tmux configuration settings
I made this configuration using https://tmuxai.dev/

## Install Tmux on your machine
Here is a guid on [how to install tmux](https://tmuxcheatsheet.com/how-to-install-tmux/)

## Install Tmux Plugin Manager
To setup tmux plugin manager use:
```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```
To install Plugins use in tmux press ``prefix`` + ``I`` to fetch the plugin.

here is [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm)

## My Config File

Here is my *tmux.conf* configuration file:
```config
    
# Tmux Configuration
# Generated with TmuxAI Config Generator
# https://tmuxai.dev

# -- Basic Settings ------------------------------------------
set -g prefix C-Space
set -g escape-time 0
set -g history-limit 5000
set -g base-index 1
set -g pane-base-index 1
set -g mouse on
set -g default-terminal "xterm-256color"
set -g mode-keys vi

# -- Key Bindings ------------------------------------------

# Pane navigation
bind Left select-pane -L
bind Down select-pane -D
bind Up select-pane -U
bind Right select-pane -R

# -- Status Bar ---------------------------------------------
set -g status-position bottom
set -g status-interval 1
set -g status-left "#{session_name} #{?client_prefix,#[bg=red]PREFIX#[default],} "
set -g status-left-length 50
set -g status-right "#{host} %Y-%m-%d %H:%M"
set -g status-right-length 50

# -- Resurrect -----------------------------------------------
# Keybindings for resurrect
 set -g @resurrect-dir '~/.tmux/resurrect' 

# --  Continuum -----------------------------------------------
# Enable Automatic Saving
#set -g @continuum-boot 'on'
#set -g @continuum-restore 'on'

# -- Plugins -----------------------------------------------
# Plugin manager
set -g @plugin 'tmux-plugins/tpm'

# Other plugins
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'

# Initialize TMUX plugin manager
# Keep this line at the very bottom of tmux.conf
run '~/.tmux/plugins/tpm/tpm'

```
    
To link the config file use the following cmd:

```bash
ln -s ./scripts/tmux.conf ~/.tmux.conf
```

## My Customization
```vim
" For making the terminal colors the same as my normal terminal
set -g default-terminal "xterm-256color"
" This made the space in copy mode start selecting 
set -g mode-keys vi
```
