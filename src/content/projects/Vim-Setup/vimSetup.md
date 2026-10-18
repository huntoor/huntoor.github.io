---
title: "My Vim Setup"
description: "How I setup my vim config"
date: "May 21 2026"
---

# Setting up Vim for myself

## First Install Vim on you machine
Here you go [Vim](https://www.vim.org/). Enjoy :)

## Now its time to install vim-plug to start installing plug-ins

using this link follow the installation guide [vim-plug](https://github.com/junegunn/vim-plug)

After installing you will need to edit your plugins in the ~/.vimrc

here is my [.vimrc](https://github.com/huntoor/myDocumentation/blob/main/scripts/vimrc) file

You can link the config file using the following cmd:
```bash
    ln -s ./scripts/vimrc ~/.vimrc
```

Reload the file or restart Vim, then you can,

- ``:PlugInstall`` to install the plugins

- ``:PlugUpdate`` to install or update the plugins

- ``:PlugDiff`` to review the changes from the last update

- ``:PlugClean`` to remove plugins no longer in the list

### Reloading vimrc file
You can use ``:source ~/.vimrc`` to reload the vimrc file

## coc.nvim Setup
To install language servers use:

For C/C++:
```vim
:CocInstall coc-clangd
```
For the language server you will have to install `clangd` on your device

For Python
```vim
:CocInstall coc-python
```

For Rust:
```vim
:CocInstall coc-rust-analyzer
```

My `:CocConfig`:
```config
{
     "inlayHint.enable": false,
     "clangd.arguments": [
       "--header-insertion=never"
     ]
}
```
