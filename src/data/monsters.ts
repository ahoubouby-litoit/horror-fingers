import type { MonsterDef } from '../types';
import {
  Bat, Demon, Frankenstein, Ghost, Mummy,
  Pumpkin, Skull, Spider, Vampire, Werewolf, Witch, Zombie,
} from '../components/monsters';

export const MONSTERS: MonsterDef[] = [
  {
    id: 'ghost', name: 'Ghost', color: '#99aaff', sound: 'ghost', Component: Ghost,
    spawnAnim: { name: 'spawnGhost', duration: '3s', easing: 'ease-out' },
  },
  {
    id: 'pumpkin', name: 'Jack-o-Lantern', color: '#ff6600', sound: 'cackle', Component: Pumpkin,
    spawnAnim: { name: 'spawnPumpkin', duration: '2.8s', easing: 'cubic-bezier(.22,.68,0,1.2)' },
  },
  {
    id: 'skull', name: 'Skull', color: '#e8e0d0', sound: 'rattle', Component: Skull,
    spawnAnim: { name: 'spawnSkull', duration: '3s', easing: 'ease-out' },
  },
  {
    id: 'bat', name: 'Bat', color: '#cc44ff', sound: 'bat', Component: Bat,
    spawnAnim: { name: 'spawnBat', duration: '2.6s', easing: 'ease-in-out' },
  },
  {
    id: 'spider', name: 'Spider', color: '#ff2200', sound: 'hiss', Component: Spider,
    spawnAnim: { name: 'spawnSpider', duration: '3s', easing: 'cubic-bezier(.36,.07,.19,.97)' },
  },
  {
    id: 'vampire', name: 'Vampire', color: '#cc0044', sound: 'screech', Component: Vampire,
    spawnAnim: { name: 'spawnVampire', duration: '2.8s', easing: 'ease-out' },
  },
  {
    id: 'zombie', name: 'Zombie', color: '#88cc44', sound: 'groan', Component: Zombie,
    spawnAnim: { name: 'spawnZombie', duration: '3.3s', easing: 'ease-in-out' },
  },
  {
    id: 'witch', name: 'Witch', color: '#aa44ff', sound: 'cackle', Component: Witch,
    spawnAnim: { name: 'spawnWitch', duration: '2.9s', easing: 'ease-out' },
  },
  {
    id: 'franken', name: 'Frankenstein', color: '#88cc66', sound: 'thunder', Component: Frankenstein,
    spawnAnim: { name: 'spawnFranken', duration: '2.9s', easing: 'ease-out' },
  },
  {
    id: 'werewolf', name: 'Werewolf', color: '#cc8844', sound: 'howl', Component: Werewolf,
    spawnAnim: { name: 'spawnWerewolf', duration: '2.7s', easing: 'cubic-bezier(.22,.68,0,1.1)' },
  },
  {
    id: 'mummy', name: 'Mummy', color: '#c8b890', sound: 'eerie', Component: Mummy,
    spawnAnim: { name: 'spawnMummy', duration: '3.4s', easing: 'ease-in-out' },
  },
  {
    id: 'demon', name: 'Demon', color: '#ff2244', sound: 'screech', Component: Demon,
    spawnAnim: { name: 'spawnDemon', duration: '2.8s', easing: 'ease-out' },
  },
];
