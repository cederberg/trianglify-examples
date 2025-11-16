# Trianglify Examples

Examples and tool for generating trianglify SVG patterns (macOS only).

- Generates unique SVG patterns with random color palettes
- Mixes colorbrewer palettes with custom random palettes
- Each SVG includes metadata comment with settings

Created SVG files are saved in the `generated-files/` directory.


## Installation

Requires macOS with brew installed. Run setup command once:

	brew install pkg-config cairo pango libpng jpeg giflib librsvg node@20

Thereafter the basic node packages can be installed:

    make install


## Usage

    make COUNT=10 run

Or directly via node:

    ./start.js --settings '{"xColors":["#c84d79","#fae5e5","#6f223e"}' 10
