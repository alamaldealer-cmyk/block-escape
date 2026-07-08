export type BlockData = {
  id: number;
  x: number;
  y: number;
  size: number;
  dir: 'H' | 'V';
  type: 'target' | 'obstacle' | 'color';
  color?: 'red' | 'orange' | 'teal' | 'blue' | 'green' | 'purple';
};

export type LevelData = {
  level: number;
  blocks: BlockData[];
};

export type ScrewGate = {
  side: 'top' | 'bottom' | 'left' | 'right';
  index: number;
  color: 'red' | 'orange' | 'teal' | 'blue' | 'green' | 'purple';
};

export type ScrewLevelData = {
  level: number;
  blocks: (BlockData & { color: 'red' | 'orange' | 'teal' | 'blue' | 'green' | 'purple' })[];
  gates: ScrewGate[];
  maxMoves: number;
  minMoves: number;
};

export const LEVELS: LevelData[] = [
  {
    level: 1,
    blocks: [
      { id: 1, x: 0, y: 2, size: 2, dir: "H", type: "target" },
      { id: 2, x: 4, y: 0, size: 3, dir: "V", type: "obstacle" }
    ]
  },
  {
    level: 2,
    blocks: [
      { id: 1, x: 0, y: 2, size: 2, dir: "H", type: "target" },
      { id: 2, x: 4, y: 0, size: 3, dir: "V", type: "obstacle" },
      { id: 3, x: 2, y: 2, size: 2, dir: "V", type: "obstacle" },
      { id: 4, x: 2, y: 4, size: 2, dir: "H", type: "obstacle" },
      { id: 5, x: 4, y: 3, size: 2, dir: "H", type: "obstacle" },
      { id: 6, x: 0, y: 0, size: 2, dir: "H", type: "obstacle" },
      { id: 7, x: 0, y: 3, size: 2, dir: "V", type: "obstacle" }
    ]
  }
];

export const SCREW_LEVELS: ScrewLevelData[] = [
  {
    level: 1,
    maxMoves: 15,
    minMoves: 4,
    gates: [
      { side: 'left', index: 2, color: 'red' },
      { side: 'bottom', index: 4, color: 'green' }
    ],
    blocks: [
      { id: 101, x: 2, y: 2, size: 2, dir: "V", type: "color", color: "red" },
      { id: 102, x: 4, y: 3, size: 2, dir: "V", type: "color", color: "green" }
    ]
  },
  {
    level: 2,
    maxMoves: 25,
    minMoves: 8,
    gates: [
      { side: 'right', index: 1, color: 'teal' },
      { side: 'bottom', index: 2, color: 'blue' },
      { side: 'left', index: 4, color: 'orange' }
    ],
    blocks: [
      { id: 101, x: 2, y: 1, size: 2, dir: "H", type: "color", color: "teal" },
      { id: 102, x: 2, y: 2, size: 2, dir: "V", type: "color", color: "blue" },
      { id: 103, x: 3, y: 4, size: 2, dir: "H", type: "color", color: "orange" }
    ]
  },
  {
    level: 3,
    maxMoves: 35,
    minMoves: 12,
    gates: [
      { side: 'right', index: 2, color: 'red' },
      { side: 'top', index: 3, color: 'teal' },
      { side: 'left', index: 3, color: 'orange' },
      { side: 'bottom', index: 1, color: 'blue' }
    ],
    blocks: [
      { id: 101, x: 1, y: 2, size: 2, dir: "H", type: "color", color: "red" },
      { id: 102, x: 3, y: 1, size: 2, dir: "V", type: "color", color: "teal" },
      { id: 103, x: 2, y: 3, size: 2, dir: "H", type: "color", color: "orange" },
      { id: 104, x: 1, y: 4, size: 2, dir: "V", type: "color", color: "blue" }
    ]
  },
  {
    level: 4,
    maxMoves: 45,
    minMoves: 18,
    gates: [
      { side: 'right', index: 1, color: 'purple' },
      { side: 'top', index: 3, color: 'green' },
      { side: 'left', index: 3, color: 'orange' },
      { side: 'bottom', index: 1, color: 'red' },
      { side: 'bottom', index: 4, color: 'teal' }
    ],
    blocks: [
      { id: 101, x: 0, y: 1, size: 3, dir: "H", type: "color", color: "purple" },
      { id: 102, x: 3, y: 1, size: 2, dir: "V", type: "color", color: "green" },
      { id: 103, x: 2, y: 3, size: 2, dir: "H", type: "color", color: "orange" },
      { id: 104, x: 1, y: 3, size: 2, dir: "V", type: "color", color: "red" },
      { id: 105, x: 4, y: 3, size: 2, dir: "V", type: "color", color: "teal" }
    ]
  },
  {
    level: 5,
    maxMoves: 55,
    minMoves: 25,
    gates: [
      { side: 'right', index: 1, color: 'red' },
      { side: 'top', index: 3, color: 'blue' },
      { side: 'left', index: 3, color: 'green' },
      { side: 'bottom', index: 4, color: 'orange' },
      { side: 'right', index: 5, color: 'purple' },
      { side: 'top', index: 0, color: 'teal' }
    ],
    blocks: [
      { id: 101, x: 1, y: 1, size: 2, dir: "H", type: "color", color: "red" },
      { id: 102, x: 3, y: 1, size: 2, dir: "V", type: "color", color: "blue" },
      { id: 103, x: 1, y: 3, size: 2, dir: "H", type: "color", color: "green" },
      { id: 104, x: 4, y: 3, size: 2, dir: "V", type: "color", color: "orange" },
      { id: 105, x: 3, y: 5, size: 2, dir: "H", type: "color", color: "purple" },
      { id: 106, x: 0, y: 2, size: 2, dir: "V", type: "color", color: "teal" }
    ]
  }
];
