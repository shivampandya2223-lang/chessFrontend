import {create} from "zustand";
interface boardTheme {
  name: string;
    maps: {
        map: string;
        normalMap: string;
        roughnessMap: string;
        aoMap: string;
    };
}
export const BOARD_THEME = [
  {
    name: "rosewood",
    maps: {
      map: "/rosewood-texture/rosewood_veneer1_diff_4k.jpg",
      normalMap: "/rosewood-texture/rosewood_veneer1_nor_gl_4k.jpg",
      roughnessMap: "/rosewood-texture/rosewood_veneer1_rough_4k.exr",
      aoMap: "/rosewood-texture/rosewood_veneer1_ao_4k.jpg",
    },
  },
  {
    name: "laminate",
    maps: {
      map: "/laminate-texture/laminate_floor_02_diff_4k.jpg",
      normalMap: "/laminate-texture/laminate_floor_02_nor_gl_4k.exr",
      roughnessMap: "/laminate-texture/laminate_floor_02_rough_4k.exr",
      aoMap: "/laminate-texture/laminate_floor_02_ao_4k.jpg",
    },
  },
  {
    name: "diagonal",
    maps: {
      map: "/laminate-texture/rosewood_veneer1_diff_4k.jpg",
      normalMap: "/laminate-texture/rosewood_veneer1_nor_gl_4k.exr",
      roughnessMap: "/laminate-texture/rosewood_veneer1_rough_4k.exr",
      aoMap: "/laminate-texture/rosewood_veneer1_ao_4k.jpg",
    },
  },
];

export const useBoardThemeStore = create<{
  currentTheme: boardTheme;
  setCurrentTheme: (themeName: string) => void;
}>((set) => ({
  currentTheme: BOARD_THEME[0], 
  setCurrentTheme: (themeName) => {
    const theme = BOARD_THEME.find((t) => t.name === themeName);
    if (theme) {
      set({ currentTheme: theme });
    }
  },
}));