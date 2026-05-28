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

here is my *.vimrc* file:
```config

call plug#begin()

" Add your plugins here

" NERDTree is a file system explorer for the Vim editor
Plug 'preservim/nerdtree'
" Rainbow Parentheses
Plug 'frazrepo/vim-rainbow'
" Lightline statusline/tabline plugin for Vim
Plug 'itchyny/lightline.vim'

call plug#end()

"" NERDTree
" Using CTR+b to Toggle NERDTree
nnoremap <C-b> :NERDTreeToggle<CR>
" Start NERDTree and put the cursor back in the other window.
autocmd VimEnter * NERDTree | wincmd p
" Shift focuse on to NERDTree using \n
nnoremap <leader>n :NERDTreeFocus<CR>
" Show Hidden Files in NERDTREE
let NERDTreeShowHidden=1 
" Exit Vim if NERDTree is the only window remaining in the only tab.
autocmd BufEnter * if tabpagenr('$') == 1 && winnr('$') == 1 && exists('b:NERDTree') && b:NERDTree.isTabTree() | call feedkeys(":quit\<CR>:\<BS>") | endif

"" Global Things
" Adding Numbers on the left for file types
au FileType c,cpp,py,logs,conf,h setlocal number 
" Add Padding to the left 
set foldcolumn=1
" Changing Indentation Width
set tabstop=4
set shiftwidth=4
" Make VIM use system clipboard by default
set clipboard=unnamed
" Compile shortcut
" Compile & Run C program
autocmd FileType c nnoremap <F4> :w <bar> exec '!gcc '.shellescape('%').' -o '.shellescape('%:r').' && ./'.shellescape('%:r')<CR>

" Setting up Cursore 
" blinking I-beam in insert mode  
let &t_SI = "\<esc>[5 q"
" Block Beam otherwise
let &t_EI = "\<esc>[2 q"
" Reset Beam to default value for terminal
autocmd VimLeave * silent !echo -ne "\e[5 q" 


"" Shell-style navigation in insert mode
" Move to beginning of line (Ctrl+A)
inoremap <C-a> <Esc>I
" Move to end of line (Ctrl+E)
inoremap <C-e> <Esc>A
" Delete to beginning of line (Ctrl+U)
inoremap <C-u> <Esc>d0xa
" Delete to end of line (Ctrl+K)
inoremap <C-k> <Esc>d$a
" Move backward a word (Alt+B)
inoremap <A-b> <Esc>bi
" Move forward a word (Alt+F)
inoremap <A-f> <Esc>ea
" Delete previous word (Ctrl+W)
inoremap <C-w> <Esc>diwa
" Delete next word (Alt+D)
inoremap <A-d> <Esc>dea
" Undo (Ctrl+Z)
inoremap <C-z> <Esc>ua

"" Rainbow Parentheses
" Load Rainbow Parentheses Gloablly
let g:rainbow_active = 1

"" LightLine
let g:lightline = {
      \ 'colorscheme': 'wombat',
      \ 'active': {
      \   'left': [ [ 'mode', 'paste' ],
      \             [ 'gitbranch', 'readonly', 'filename', 'modified' ] ]
      \ },
      \ 'component_function': {
      \   'gitbranch': 'FugitiveHead'
      \ },
      \ }

```

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
