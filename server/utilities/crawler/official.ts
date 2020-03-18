import axios from 'axios';
import { JSDOM } from 'jsdom';
import { CharacterImage, CharacterElement } from '../../schemas/character';

type Image = {
  name: string;
  element: CharacterElement;
} & CharacterImage;

const fallback = 'https://worldflipper.jp/character/';

async function fetch(
  page: number,
  url: string = fallback
): Promise<Array<Image>> {
  const urls: Array<string> = [];
  for (let i = page; i >= 1; i--) {
    urls.push(`${url}?p=${i}`);
  }

  const data = await Promise.all(
    urls.map(async function (url) {
      const { data: html } = await axios.get(`${url}?p=${page}`);

      const { window } = new JSDOM(html);
      const document = window.document;

      const list = Array.from(document.querySelectorAll('ul.char-list > li'));

      const p = new ImageParser(list);

      return p.images;
    })
  );

  return data.reduce(function (urls, url) {
    return urls.concat(url);
  }, []);
}

export const character = {
  images: fetch
};

class ImageParser {
  static JPAttributeList: Array<CharacterElement> = [
    '火',
    '水',
    '雷',
    '風',
    '闇',
    '光'
  ];

  static ColorAttributeList: Array<string> = [
    'red',
    'blue',
    'yellow',
    'green',
    'black',
    'white'
  ];

  private doms: Array<Element>;
  images: Array<Image> = [];

  constructor(doms: Array<Element>) {
    this.doms = doms;
    this.parse();
  }

  private parse(): void {
    this.images = this.doms.map(function (dom) {
      const squarePNG = dom
        .querySelector('figure.icon img')
        ?.getAttribute('src');
      const fullShotPNG = squarePNG?.replace('square_0.png', 'full_shot_0.png');
      const info = dom.querySelector('dl.info');
      const frontGIF = info?.querySelector('img')?.getAttribute('src');
      const specialGIF = frontGIF?.replace('front.gif', 'special.gif');
      const name = info?.querySelector('dd')?.innerHTML;

      const index = ImageParser.ColorAttributeList?.indexOf(
        dom.className.trim().replace('class-', '')
      );

      return {
        name: String(name),
        element: ImageParser.JPAttributeList[index],
        square: String(squarePNG),
        fullShot: String(fullShotPNG),
        front: String(frontGIF),
        special: String(specialGIF)
      };
    });
  }
}
