---
title: "CHIP-8 Emulator"
description: "Builing CHIP8 Emulaotr using C and OpenGL"
date: "Sep 26 2026"
---

[Wikipedia Source](https://en.wikipedia.org/wiki/CHIP-8#Virtual_machine_description)

This Project was made with the help of [this blog](https://multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/)

# Virtual Machine Description
## Memory
- Machine had **4096** memory locations starting from **0x000** -> **0xFFF**
- All of the memory locations are **8 Bits (1 byte)** 
- CHIP-8 interpreter itself occupies the first 512 bytes **0x000 -> 0x1FF**
- The font data is stored in the first 512 bytes of the memory and the font characters are 0 -> F also the font is represented by a 4x5 grid
- The uppermost **256 bytes (0xF00 -> 0xFFF)** are reserved for display refresh
- The **96 bytes bellow that (0xEA0 -> 0xEFF)** reserved for the call stack, internal user, and other variables
## Registers
- CHIP-8 has **16 8-bit** data registers named **V0 to VF**, The **VF** register doubles as a flag for some instructions
- In an addition operation, **VF** is the carry flag, while in the subtraction it is the "no borrow" flag.
- In the draw instruction **VF** is set upon pixel collision
- The address register, which is named **I** is 12 bits wide and is used with several opcodes that involve memory operations
## Stack
- Stack is only used to store return addresses when subroutines are called.
- The original [RCA 1802](https://en.wikipedia.org/wiki/RCA_1802 "RCA 1802") version allocated 48 bytes for up to 12 levels of nesting
- Im using the 16 level stack in my chip
## Timers
CHIP-8 has two 8-bit timers. They both count down to 60Hz until they reach 0
- Delay timer: Intended to be used for timing the events of games. Its value can be set and read.
- Sound timer: Used for sound effects. When its value is nonzero, a beeping sound is made. Its value can only be set.
## Input
- Input is done with **hex keyboard** that has 16 keys ranging from 0 to F.
- The **2, 4, 6, 8 keys** are typically used for directional input.
- Three opcodes are used to detect input.
	- One skips an instruction if a specific key is pressed
	- the other one does the same if a specific key is not pressed
	- and the third waits for a key press, and then stores it in one of the data registers
## Graphics & Sound
- CHIP-8 display resolution is **64x32 pixels** and its color is monochrome. 
- Graphics are drawn to the screen solely by drawing sprites, which are 8 pixel wide and 1 to 15 pixels in height.
- Sprite pixels are XOR'd with corresponding screen pixels. This means that sprite pixels that are set flip the color of the corresponding screen pixels
- The Carry Flag (VF) is set to 1 if any screen pixels are flipped from set to unset when a sprite is drawn and set to 0 otherwise. This is used for collision detection
Beeping sound is made using the Sound Timer
## Opcode table
CHIP-8 has 35 opcodes, which are all 2 byutes long and stored big-endian.
Opcode symbols:
- NNN: address
- NN: 8-bit constant
- N: 4-bit constant
- X & Y: 4-bit register identifier
- PC: Program Counter
- I: 12-bit (For memory address) 
- VN: One of the 16 available variables. N is from 0 to F


| **Opcode** | **Type** | **C pseudocode**                                                        | **Explanation**                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0NNN       | Call     |                                                                         | Calls machine code routine ([RCA 1802](https://en.wikipedia.org/wiki/RCA_1802 "RCA 1802") for COSMAC VIP) at address NNN. Not necessary for most ROMs.                                                                                                                                                                                                                                     |
| 00E0       | Display  | `disp_clear()`                                                          | Clears the screen.                                                                                                                                                                                                                                                                                                                                                                         |
| 00EE       | Flow     | `return;`                                                               | Returns from a subroutine.                                                                                                                                                                                                                                                                                                                                                                 |
| 1NNN       | Flow     | `goto NNN;`                                                             | Jumps to address NNN.                                                                                                                                                                                                                                                                                                                                                                      |
| 2NNN       | Flow     | `*(0xNNN)()`                                                            | Calls subroutine at NNN.                                                                                                                                                                                                                                                                                                                                                                   |
| 3XNN       | Cond     | `if (Vx == NN)`                                                         | Skips the next instruction if VX equals NN (usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                                                                                  |
| 4XNN       | Cond     | `if (Vx != NN)`                                                         | Skips the next instruction if VX does not equal NN (usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                                                                          |
| 5XY0       | Cond     | `if (Vx == Vy)`                                                         | Skips the next instruction if VX equals VY (usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                                                                                  |
| 6XNN       | Const    | `Vx = NN`                                                               | Sets VX to NN.                                                                                                                                                                                                                                                                                                                                                                             |
| 7XNN       | Const    | `Vx += NN`                                                              | Adds NN to VX (carry flag is not changed).                                                                                                                                                                                                                                                                                                                                                 |
| 8XY0       | Assig    | `Vx = Vy`                                                               | Sets VX to the value of VY.                                                                                                                                                                                                                                                                                                                                                                |
| 8XY1       | BitOp    | `Vx \|= Vy`                                                             | Sets VX to VX [or](https://en.wikipedia.org/wiki/Logical_disjunction "Logical disjunction") VY. (bitwise OR operation).                                                                                                                                                                                                                                                                    |
| 8XY2       | BitOp    | `Vx &= Vy`                                                              | Sets VX to VX [and](https://en.wikipedia.org/wiki/Logical_conjunction "Logical conjunction") VY. (bitwise AND operation).                                                                                                                                                                                                                                                                  |
| 8XY3       | BitOp    | `Vx ^= Vy`                                                              | Sets VX to VX [xor](https://en.wikipedia.org/wiki/Xor "Xor") VY.                                                                                                                                                                                                                                                                                                                           |
| 8XY4       | Math     | `Vx += Vy`                                                              | Adds VY to VX. VF is set to 1 when there's an overflow, and to 0 when there is not.                                                                                                                                                                                                                                                                                                        |
| 8XY5       | Math     | `Vx -= Vy`                                                              | VY is subtracted from VX. VF is set to 0 when there's an underflow, and 1 when there is not. (i.e. VF set to 1 if VX >= VY and 0 if not).                                                                                                                                                                                                                                                  |
| 8XY6       | BitOp    | `Vx >>= 1`                                                              | Shifts VX to the right by 1, then stores the least significant bit of VX prior to the shift into VF.                                                                                                                                                                                                                                                                                       |
| 8XY7       | Math     | `Vx = Vy - Vx`                                                          | Sets VX to VY minus VX. VF is set to 0 when there's an underflow, and 1 when there is not. (i.e. VF set to 1 if VY >= VX).                                                                                                                                                                                                                                                                 |
| 8XYE       | BitOp    | `Vx <<= 1`                                                              | Shifts VX to the left by 1, then sets VF to 1 if the most significant bit of VX prior to that shift was set, or to 0 if it was unset.                                                                                                                                                                                                                                                      |
| 9XY0       | Cond     | `if (Vx != Vy)`                                                         | Skips the next instruction if VX does not equal VY. (Usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                                                                         |
| ANNN       | MEM      | `I = NNN`                                                               | Sets I to the address NNN.                                                                                                                                                                                                                                                                                                                                                                 |
| BNNN       | Flow     | `PC = V0 + NNN`                                                         | Jumps to the address NNN plus V0.                                                                                                                                                                                                                                                                                                                                                          |
| CXNN       | Rand     | `Vx = rand() & NN`                                                      | Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.                                                                                                                                                                                                                                                                                          |
| DXYN       | Display  | `draw(Vx, Vy, N)`                                                       | Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels. Each row of 8 pixels is read as bit-coded starting from memory location I; I value does not change after the execution of this instruction. As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that does not happen. |
| EX9E       | KeyOp    | `if (key() == Vx)`                                                      | Skips the next instruction if the key stored in VX(only consider the lowest nibble) is pressed (usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                              |
| EXA1       | KeyOp    | `if (key() != Vx)`                                                      | Skips the next instruction if the key stored in VX(only consider the lowest nibble) is not pressed (usually the next instruction is a jump to skip a code block).                                                                                                                                                                                                                          |
| FX07       | Timer    | `Vx = get_delay()`                                                      | Sets VX to the value of the delay timer.                                                                                                                                                                                                                                                                                                                                                   |
| FX0A       | KeyOp    | `Vx = get_key()`                                                        | A key press is awaited, and then stored in VX (blocking operation, all instruction halted until next key event, delay and sound timers should continue processing).                                                                                                                                                                                                                        |
| FX15       | Timer    | `delay_timer(Vx)`                                                       | Sets the delay timer to VX.                                                                                                                                                                                                                                                                                                                                                                |
| FX18       | Sound    | `sound_timer(Vx)`                                                       | Sets the sound timer to VX.                                                                                                                                                                                                                                                                                                                                                                |
| FX1E       | MEM      | `I += Vx`                                                               | Adds VX to I. VF is not affected.                                                                                                                                                                                                                                                                                                                                                          |
| FX29       | MEM      | `I = sprite_addr[Vx]`                                                   | Sets I to the location of the sprite for the character in VX(only consider the lowest nibble). Characters 0-F (in hexadecimal) are represented by a 4x5 font                                                                                                                                                                                                                               |
| FX33       | BCD      | set_BCD(Vx)<br>*(I+0) = BCD(3);<br>*(I+1) = BCD(2);<br>*(I+2) = BCD(1); | Stores the [binary-coded decimal](https://en.wikipedia.org/wiki/Binary-coded_decimal "Binary-coded decimal") representation of VX, with the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.                                                                                                                                 |
| FX55       | MEM      | `reg_dump(Vx, &I)`                                                      | Stores from V0 to VX (including VX) in memory, starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.                                                                                                                                                                                                                         |
| FX65       | MEM      | `reg_load(Vx, &I)`                                                      | Fills from V0 to VX (including VX) with values from memory, starting at address I. The offset from I is increased by 1 for each value read, but I itself is left unmodified.                                                                                                                                                                                                               |

# Implementation 
## Header file (chip8.h)
### Memory
An array of size 4096 of 8 bits 
```c
uint8_t memory[4096];
```
#### Memory Map:
- First 512 bytes **0x000 -> 0x1FF** CHIP-8 interpreter
- **0x050 -> 0x0A0** for 4x5 pixel font set (0 - F)
- **0x200 -> 0FFF** for program ROM and work RAM

### Registers
array of size 16 of 8-bits for V0 -> VF
```c
uint8_t v[16];
```

Address register **I** 12-bits (2 bytes) & Program counter of size 12-bits  (Program counter has memory address from 0 -> 4095 that's 12 bits, however we are using 16 bits value as it is simpler to represent and work with)
```c
uint16_t I;
uint16_t pc;
```

### Stack
Stack stores return addresses, and return addresses are memory address, so the stack stores 16 levels of addresses each address is 12-bits, we are using 16 for the same reason as Registers
```c
uint16_t stack[16];
uint8_t sp; // stack pointer
```

### Timer
For the timer we are using 8-bit unsigned int 
```c
uint8_t delay_timer;
uint8_t sound_timer;
```

### Input 
Input is a hexadecimal keypad with a 16 keys, numbered from 0x0 -> 0xF
```
Keypad                   Keyboard
+-+-+-+-+                +-+-+-+-+
|1|2|3|C|                |1|2|3|4|
+-+-+-+-+                +-+-+-+-+
|4|5|6|D|                |Q|W|E|R|
+-+-+-+-+       =>       +-+-+-+-+
|7|8|9|E|                |A|S|D|F|
+-+-+-+-+                +-+-+-+-+
|A|0|B|F|                |Z|X|C|V|
+-+-+-+-+                +-+-+-+-+
```

```c
uint8_t key[16];
```

### Graphics
and for the Graphics the size of the screen is 64x32, as for each pixel is 1-byte 
```c
uint8_t grphx[64 * 32];
```

### Opcode
as the Opcode is stored in 2-byte long 
```c
unit16_t opcode;
```

## Chip-8 file (chip8.c)
### initializing chip-8
First I initialize all variables. mostly they are set to 0 however for the program counter I initialize it to ***0x200*** as chip-8 interpreter is stored in the first 512 bytes *0x000* -> *0x1FF*

As for the font it is stored in the first 512 bytes of memory and the characters are from 0 -> F, as for the size its 4x5. The font is set like following:

***0 Sprite:***
```txt
Hex    Bin          Sprite
0xF0   1111 0000     ****
0x90   1001 0000     *  *
0x90   1001 0000     *  *
0x90   1001 0000     *  *
0xF0   1111 0000     ****
```

***1 Sprite:***
```txt
Hex    Bin          Sprite
0x20   0010 0000       *
0x60   0110 0000      **
0x20   0010 0000       *
0x20   0010 0000       *
0x70   0111 0000      ***
```
and so on...

Since each font sprite is 5 8-bit and there are 16 characters in the font then the an 8-bit array with size of 80 will store the whole font
```c
uint8_t chip8_fontset[80];
```

### Loading Game
Basically to load a game means that we first need to initialize the CHIP and then  get a binary game file copy it to a buffer check if the size is bigger that the maximum ROM size or not then copy and past bytes to the CHIP8's  memory array.

To check the size of the file we first `fopen` save it into a `FILE` pointer then check if the file is `NULL` or not. after that we can then use the following
```c
fseek(pGameFile, 0, SEEK_END);
size_t fileSize = ftell(pGameFile);
```
`fseek` will make the FILE variable point to the end of the file, then using `ftell` return the file size in bytes.

For the buffer I allocated memory equal to the size of the file we just got.
```c
uint8_t *pBuff = (uint8_t *)malloc(sizeof(uint8_t) * fileSize);
```
Then I read the game binary file and wrote it to the buffer using:
```c
if (fread(pBuff, 1, fSize, pGameFile) != fSize)
{
	perror("Error reading Game File");
	free(pBuff);

	fclose(pGameFile);
	return false;
}
```
After that I copied the buffer to the CHIP memory, keep in mind that the memory starts from *512* as the first 512 bytes are reserved.
```c
for (int i = 0; i < fSize; i++)
{
	memory[MEM_START_ADDR + i] = pBuff[i];
}
```

### Cycle Emulation
Here I followed the [Wikipedia's](https://en.wikipedia.org/wiki/CHIP-8#Graphics_and_sound) Opcode table explanation, other than calculating the hex and stuff, its easy to follow and implement. 

*I wont be documenting the easy opcodes such as those that assigns the Vx or Vy to an integer or Conditional opcodes.*

#### Fetching Opcode
First thing first as memory is 8-bit size and the opcode is 16-bits long, we need to get memory at position "`pc`" shift it to the right by 8 and then use bitwise OR with the next memory position "`pc + 1`"
```c
	opcode = memory[pc] << 8 | memory[pc + 1];
//	opcode = 0x00AB     << 8 | 0x00CD
//	opcode = 0xAB00          | 0x00CD
//  opcode = 0xABCD
```

#### Decoding Opcodes
After fetching an opcode, we need to decode it and execute the corresponding instruction. Looking at the CHIP-8 opcode table, we can see that instructions are grouped into families. These families can be identified by the highest nibble (the first hexadecimal digit) of the opcode.

Eg., {`0NNN`, `00E0`, `00EE`} all begin with `0x0`, meaning they belong to the same instruction family. To identify the family, we can use a `switch` statement and mask the opcode with `0xF000`, which is the highest nibble.

Also. some families contain multiple instructions that share the same highest nibble. In these cases, a second `switch` statement can be used to examine additional bits of the opcode and determine the exact instruction. This creates a hierarchical decoding process: first identify the instruction family, then identify the specific instruction within that family.

Eg:
```c
switch (opcode & 0xF000)
{
    case 0x0000:
        switch (opcode & 0x00FF)
        {
            case 0x00E0:
                // code...
                break;
                
            case 0x00EE:
                // code...
                
                break;
            default:
                printf("Unknown opcode [0x0000]: 0x%X\n", opcode);
        }
        break;
    case 0x1000:
        // ...
        break;
}
```

#### 0x00E0
Opcode to clear the screen, basically you will iterate over the (64 * 32) grphx array and set it to 0, then go to the next instruction by adding 2 to `pc` 
```c
for (int i = 0; i < (SCREEN_WIDTH * SCREEN_HIGHT); i++)
	{
	grphx[i] = 0;
	}

pc += 2;
```

#### 0x00EE
Returns from a subroutine to address pulled from stack, this means that you will need to get the last subroutine address in the stack and store it in the program counter, so first you need to decrement the stack pointer `sp` by one then assign the `pc = stack[sp]`
```c
case 0x00ee:
	sp -= 1;
	pc = stack[sp];
	
	pc += 2;
	break
```

#### 0x1NNN
Jump to address NNN, so we need to set the program counter to address NNN. To get the NNN address I masked the used opcode with `0x0fff`, eg. assuming that `opcode = 0x1ABC`, by masking it with `0x0fff` you get `pc = 0x0ABC`  
```c
case 0x1NNN
	pc = opcode & 0x0fff;
	break
```

#### 0x2NNN
Push return address onto stack and call subroutine at address NNN. its the same as `0x1NNN` with just the difference of you need to store the current `pc` onto the stack then increment the stack pointer by one, after that assign the `pc = opcode & 0x0fff;` 

#### 0x3XNN
Skips next instruction if Vx equals to NN. So we need to first get `X` and `NN`,  then compare if Vx is equals to NN then increment `pc` by 4 to skip the next instruction, else `pc += 2`
```c
case 0x3NNN: // 0x3XNN Skips next instruction if Vx equals to NN
{
	uint8_t X = (opcode & 0x0f00) >> 8; // 0x3ABC & 0x0f00 = 0x0A00; Needs to be shifted 8 bits to the right
	uint8_t NN = opcode & 0x00ff; // 0x3ABC & 0x00ff = 0x00BC;
	if (v[X] == NN)
	{
		pc += 4;
	} else {
		pc += 2;
	}
	break;
}
```
For **0x4XNN, 0x5XY0, 0x9XY0** its implemented the same way, to extract `Y` its exactly the same as `X` but you will mask it with `0x00f0` then shift it by 4 instead
```c
uint8_t Y = (opcode & 0x00f0) >> 4;
```

***Note**: From this onward,  `X`, `Y` and `NN` are extracted in the same way throughout the code base, so I wont be writing it in the code examples again*

#### 0x6XNN
Sets Vx to NN, fairly simple you just get the Vx and NN then set Vx to NN
```c
case 0x6XNN
	v[X] = NN;
	break;
```
For **0x7XNN, 0x8XY0, 0x8XY1, 0x8XY2, 0x8XY3** all implemented exactly the same way, you just need to change the mathematical operation depending on the opcode

#### 0x8XY4
Adds Vy to Vx, if there is an overflow then set Vf to 1 else set it to 0. 
```c
Case 0x8XY4
	uint16_t sum = v[X] + v[Y];
	if (sum > 0xff)
	{
		v[0xf] = 1;
	} else {
		v[0xf] = 0;
	}
	
	v[X] = sum;
	pc += 2;
	break;
```
For **0x8XY5, 0x8XY7** is the same you will just check if the Vx is bigger/smaller than Vy or not if so set Vf to 1 else Vf is set to 0

#### 0x8XY6
Store the least significant bit of Vx into Vf, then shift Vx to the right by 1. To get the LSB from 8-bits, you can mask them with 1.
eg.
```txt
0xAB & 0x1 -> 1010 101(1) & 0000 0001 = 0000 0001
```

#### 0x8XYE
Stores the most significant bit of Vx into Vf, then shift Vx to the left by 1. To get the MSB form an 8-bit integer, you first need to mask it with 0x80 and then shift it by 7 to the right
eg.
```txt
0xAB & 0x80 -> (1)010 1011 & 1000 0000 = 1000 0000 >> 7 = 0000 0001
```
#### 0xANNN
Sets I to the address of NNN. 
```c
case 0xANNN:
	uint16_t NNN = opcode & 0x0fff;
	I = NNN;
	pc += 2;
	break;
```
For **0xBNNN** its basically the same you just need to add V0 to the NNN 

#### 0xCXNN
Sets Vx to result of bitwise and operation on a random number from 0 -> 254.
```c
case 0xCXNN:
	uint16_t randNo = rand() & 255
	v[X] = randNo & NN;
	
	pc += 2;
	break;
```

#### 0xDXYN
Draws a sprite at (Vx, Vy) with data starting at address I, I is not changed, and the size of the sprite it 8xN. Vf is set to 1 if any screen pixel are fliped from 1 to 0, and set to 0 otherwise, this way the you can detect collision.

So to draw the sprite we first need to set Vf to 0 then we will need two for loops the first on is for yAxis and the otherone is the xAxis, in the yAxis loop we need to get the pixel value that will be drawn, and going to the xAxis loop, I first set a limit to the screen x and y to 64 and 32 respectively, the get the location of the pixel and check if the `grphx[pixelLocation]` is 1 that means that the pixel wil get flipped from 1 to 0 then set Vf to 1, and at last xor the  `grphx[pixelLocation]` by 1.
```c
case 0xDXYN:
	v[0xf] = 0;
	for (uint8_t yAxis = 0; yAxis < hight; yAxis++)
	{
		pixel = memory[I + yAxis]; // Get value of pixel eg. (0xab -> 1010 1011)
		for (uint8_t xAxis = 0; xAxis < width; xAxis++)
		{
			// Check if the X axis is set to 0 or 1
			// If pixel is set draw it (1000 0000) (0100 0000)
			if (pixel & (0x80 >> xAxis)) // for x = 0 (1010 1011 & (1000 0000 >> 0000 0000)) = 1 then pixel is set | for x = 1 (1010 1011 & (1000 0000 >> 0000 0001) = 0) = 0 then pixel is not set
			{
			uint16_t screenX = (v[X] + xAxis) % SCREEN_WIDTH; // Limit screen x to 64
			uint16_t screenY = (v[Y] + yAxis) % SCREEN_HIGHT; // Limit screen y to 32
			
			uint16_t pixelLocation = screenX + (screenY * SCREEN_WIDTH);
			
			// Check if position of pixel is set or not. If it is set then there is collision and we set Vf to 1
			if (grphx[pixelLocation]) // Detect collision
			{
			v[0xf] = 1;
			}
			// Sprite is drawn by XORing sprite pixels into screen
			grphx[pixelLocation] ^= 1;
			}
		}
	}
	pc += 2;
	break;
```


#### 0xEX9E
Skips next instruction if the key stored in Vx is pressed.
```c
case 0xEX8E:
	if (key[v[X]])
	{
		pc += 4;
	} else 
	{
		pc += 2;
	}
	break;
```
For `0xEX8E` its pretty much the same, you just to reverse the logic.

#### 0xFX07
Sets Vx to value of delay timer.
```c
case 0xFX07:
	v[X] = delay_timer;
```
#### 0xFX0A
Await key press and stores it in Vx, All instructions are halted until next key event. So first we need to loop over the 16 keys check if the `key[i]` is pressed or not if so set Vx to `i` and go to the next instruction, else return to try again 
```c
case 0xFX0A:
	bool isPressed = false;
	
	for (uint8_t i = 0; i < 16; i++)
	{
		if (key[i])
		{
			v[X] = i;
			isKeyPressed = true;
		}
	}
	if (!isKeyPressed) return;
	
	pc += 2;
	break;
```

#### 0xFX15
Sets the delay timer to Vx.
```c
case 0xFX15:
	delay_timer = v[X];
	break;
```
For `0xFX18`, its the same u just need to set the `sound_timer` to Vx

#### 0xFX1E
Adds Vx to I. 

***Note:** Most CHIP-8 interpreters' FX1E instructions do not affect VF, with one exception: the CHIP-8 interpreter for the Commodore Amiga sets VF to 1 when there is a range overflow (I+VX>0xFFF), and to 0 when there is not. The only known game that depends on this behavior is Spacefight 2091!, while at least one game, Animal Race, depends on VF not being affected.*
```c
case 0xFX1E:
	uint16_t sum = I + v[X];
	if (sumn > 0xfff) // Check if the sum is bigger that 12-bits 
	{
		v[0xf] = 1;
	} else
	{
		v[0xf] = 0;
	}
	
	I = sum;
	
	px += 2;
	break;
```

#### 0xFX29
Sets the index register `I` to the location of the sprite corresponding to the hexadecimal digit stored in `Vx`.. This means that we will start the first address of the character sprite in I, and as we stored the font characters at memory location 0. this means that for character 0 it will take the address from 0 to 4, as it is 5 pixels high (font is 4x5). and for say character 5 it will be starting at memory location `5 * 5 = 25` so the implementation for this opcode is as follows:
```c
case 0xFX29:
	I = v[X] * 0x5;
	px += 2;
	break;
```

#### 0xFX33
Stores the binary coded decimal representation of Vx, where hundreds digit in memory loc `I`, tens digit at location `I + 1`, and the ones digit at loc `I + 2`. set_BCD(Vx) *(I+0) = BCD(3); *(I+1) = BCD(2); *(I+2) = BCD(1); 
eg. 
```txt
Vx = 0x7b -> 123 -> 0111 1011
I + 0 = 1 -> 0000 0001
I + 1 = 2 -> 0000 0010
I + 2 = 3 -> 0000 0011
```

```c
case 0xFX33:
	memory[i] = (v[X] % 1000) / 100;
	memory[i + 1] = (v[X] % 100) / 10;
	memory[i + 2] = (v[X] % 10);
	
	pc += 2;
	break;
```

#### 0xFX55
Sotred from V0 to Vx in memory. Basically you loop from 0 to X and assign the value of Vi to memory location `I + i`
```c
case 0xFX55:
	for (uint8_t i = 0; i <= X; i++)
	{
		memory[I + i] = v[i];
	}
	// I is incremented by X+1 after execution
	// CHIP-48/SCHIP1.0 increment I only by X, SCHIP1.1/SCHIP-MODERN not at all
	I = I + X + 1;

	px += 2;	
	break;
```
For `0xFX65` its the same idea but you will store the value of memory into Vi

### Graphics and Input
So to handle graphics and input for the games I decided to go with OpenGL so it took me around 2 months banging my head against my keyboard trying to figure out how does it work, and I only finished the first chapter (Getting Started) in [OpenGL book](https://learnopengl.com/book/book_pdf.pdf), however I now know alittle bit about how graphics works and Ill be starting on using what I've learned to render our games and handle inputs. 

#### graphics.h
I used GLFW and GLAD to handle the graphics, the basic idea behind handling this 64x32 screen was first lopping the whole `grphx` array and setting the pixels to white if `grphx[x] = 1` else set the pixel to black, I then created a texture which will hold that array of monochromatic pixels and clamped it to the edges of the screen so that it fits the whole screen, and on each emulated cycle which changes updates the `grphx[]` array there is a function that runs that updates the pixels then update the texture on screen.

##### Detailed implementation:
- `initalizeGLFW()`: 
	This function will run once on the main function to initialize the window

	Function will first setup GLFW context version and OpenGL Profile
	```c
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

#ifdef __APPLE__
glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif
	```
	Then I created the window and set the current context to that window and if any of those did fail the function will return false and that will throw an error stoping the while emulator.

	After that I set the viewport initially and then keep it updated whenever the window get resized
	```c
	// Tell OpenGL size of rendering window
int fbW, fbH;
glfwGetFramebufferSize(window, &fbW, &fbH);
framebuff_size_callback(window, fbW, fbH);

// Change viewPort when user resize screen
glfwSetFramebufferSizeCallback(window, framebuff_size_callback);
	```

	Then I setup the shaders using a module that handles reading shaders, complies and links them, and Im too lazy to explain it here so you can check it out in the [OpenGL Book](https://learnopengl.com/book/book_pdf.pdf) chapter 6.6 :).

	Then I initialize the vertices for the texture which contains both position coords and texture coordinates and then setup VBO that stores the vertex data in GPU memory, and VAO which stores how that data is organized and how OpenGL should interpret that data, then setup the texture to use `GL_NEAREST` so that when texture is scale up the pixels will use the nearest pixel instead of smoothly interpolate. I also use `GL_CLAMP_TO_EDGE` to prevent unwanted wrapping at the edges. Then I initialize the `pixel` array and set every pixel in it to black, after that I uploaded the data to the GPU using `glTexImage2D()`
	```c
glGenVertexArrays(1, &VAO);
glGenBuffers(1, &VBO);

glBindVertexArray(VAO);
glBindBuffer(GL_ARRAY_BUFFER, VBO);

glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

// Setting up Position Coords
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void *) 0);
glEnableVertexAttribArray(0);

// Setting up Texture Coords
glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void *)(3 * sizeof(float)));
glEnableVertexAttribArray(1);

// Reset bindings
glBindBuffer(GL_ARRAY_BUFFER, 0);
glBindVertexArray(0);

// Setting up Textures
glGenTextures(1, &textureID);
glBindTexture(GL_TEXTURE_2D, textureID);

glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

// Clear variable pixel[] set it all to balck
for (int i = 0; i < (EM_WIDTH * EM_HIGH); i++) {
	pixel[i * 4 + 0] = 0; // Set R to 0
	pixel[i * 4 + 1] = 0; // Set G to 0
	pixel[i * 4 + 2] = 0; // Set B to 0
	pixel[i * 4 + 3] = 255; // Set A to 255
}

glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, EM_WIDTH, EM_HIGH, 0, GL_RGBA, GL_UNSIGNED_BYTE, pixel);
	``` 


- updateScreen()
	This function will run each time the `drawFlage` is set in any emulator cycle, it takes the `grphx[]` convert it to colored pixels using `convertGrphxToPx()` function, update the texture and then send it the the GPU to render.
*note: The `drawFlage` is set whenever any opCode changes anything on screen.*

- convertGrphToPx()
	Function gets the `grphx[]` array as a parameter then it loops on that array and checks if `grphx[] = 1` then set the pixel RGBA to white (255) else if `grphx[i] = 0` then set the pixel to black (0) 
	```c
void convertGrphToPx(uint8_t g[])
	{
	for (int i = 0; i < (EM_WIDTH * EM_HIGH); i++) {
		if (g[i])
		{
			// Set Pixel to white
			pixel[i * 4 + 0] = 255; // R
			pixel[i * 4 + 1] = 255; // G
			pixel[i * 4 + 2] = 255; // B
			pixel[i * 4 + 3] = 255; // A
		  
		} else {
			// Set Pixel to balck
			pixel[i * 4 + 0] = 0;
			pixel[i * 4 + 1] = 0;
			pixel[i * 4 + 2] = 0;
			pixel[i * 4 + 3] = 255;
		}
		}
	}
	```


#### Input
Handling Input is also in graphics.h as GLFW is also responsible for input handling.
- processInput()
	Basically this is the only function that will be handling the input so first I set up a way to close the whole game if you pressed on `ESC` key
	```c
// Close Window on clicking ESC
if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
{
	glfwSetWindowShouldClose(window, GLFW_TRUE);
}
	```

	For the inputs for CHIP-8, I got the key mapping from [this article](https://deepwiki.com/tavito/chip8/5.2-keyboard-input), the mapping is as follows

| CHIP-8 Keys     | Physical Keys |
| --------------- | ------------- |
| 0x1 0x2 0x3 0xC | 1 2 3 4       |
| 0x4 0x5 0x6 0xD | Q W E R       |
| 0x7 0x8 0x8 0xE | A S D F       |
| 0xA 0xB 0x0 0xF | Z X C V       |
	So when you press `Q` on your keyboard the function will get the key set the `key[0x4] = 1`  and when the key is released set `key[0x4] = 0` 

```c
// Set Keys on Press
if (glfwGetKey(window, GLFW_KEY_1) == GLFW_PRESS)
{
	key[0x1] = 1;
} else if (glfwGetKey(window, GLFW_KEY_2) == GLFW_PRESS) {
	key[0x2] = 1;
} else if (glfwGetKey(window, GLFW_KEY_3) == GLFW_PRESS) {
	key[0x3] = 1;
} ....
......


// Unset Key on release
if (glfwGetKey(window, GLFW_KEY_1) == GLFW_RELEASE)
{
	key[0x1] = 0;
} else if (glfwGetKey(window, GLFW_KEY_2) == GLFW_RELEASE) {
	key[0x2] = 0;
} else if (glfwGetKey(window, GLFW_KEY_3) == GLFW_RELEASE) {
	key[0x3] = 0;
} ....
......
```

### Main Function
For the main function I first checked if there is an argument with the game path of the file in `argv[1]` after that I pass the argument as a parameter for `loadGame` function and check if it returned any error.

Then initialize GLFW Window using `initalizeGLFW` function also checking if initializing the window threw any errors. 

Once everything is working as expected I made the emulator loop breaks if the window closes. 
```c
while (!glfwWindowShouldClose(window))
{
	// Emulate CHIP-8 Cycles code
}
```

Inside the loop I start by calling `emulateCycle()` function and then clear the OpenGL color buffer each cycle before drawing a new frame.

Next I called the `processInput()` function to check for any key presses, after that I call `useShader` function to activate the program shader ID.

And then I check if the `drawFlag` is set then update OpenGL texture using `updateScreen` function and then reset `drawFlag` to `false`.

I then bind the Vertex Array Object and use `glDrawArrays` to draw the texture on scree, after that I unbind the Vertext array and call `glfwSwapBuffers` to display new frame buffers.

And lastly I call `glfwPollEvents` to process input and window events.

### MakeFile
For the make file it basically check if Im using MacOS or Linux and compiles the emulator accordingly.  Since I use both MacOS and Linux I created a separate release directories for each one.

The Make File does 3 things:
1. `make` - Compile
This option compiles the emulator and place the executable in the specified directory based on the running OS, also the linker is given the required runtime library search path so the executable knows where to look for for its shared libraries.

2. `make package` - Package executable
For this option it will copy the shared libraries need to to the appropriate Release folder to package everything in a single folder so that the executable is portable.

3. `make clean` - Cleaning
The last option will remove the executable and all libraries from the release directory.




ツ
