// @unocss-include
export interface ButtonProps {
  tag?: string
  color?: Color
  size?: Size
}

export type Color = 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
export type Size = 'sm' | 'md' | 'lg'

export const colorToClasses = new Map<Color, string>([
  ['primary', 'bg-blue-500 hover:bg-blue-700 text-white'],
  ['secondary', 'bg-gray-500 hover:bg-gray-700 text-white'],
  ['danger', 'bg-red-500 hover:bg-red-700 text-white'],
  ['success', 'bg-green-500 hover:bg-green-700 text-white'],
  ['warning', 'bg-yellow-500 hover:bg-yellow-700 text-white'],
])
export const sizeToClasses = new Map<Size, string>([
  ['sm', 'px-2 py-1 text-sm'],
  ['md', 'px-3 py-2 text-base'],
  ['lg', 'px-4 py-3 text-lg'],
])
