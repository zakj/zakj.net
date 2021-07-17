import differenceInDays from 'date-fns/differenceInDays/index.js';
import formatDistanceStrict from 'date-fns/formatDistanceStrict/index.js';
import parse from 'date-fns/parse/index.js';

class History {
  public startDate: Date;
  public endDate: Date;

  constructor(start: string, public city: string, public description: string) {
    this.startDate = parse(start, 'yyyy-MM', new Date());
  }

  get duration() {
    return differenceInDays(this.endDate, this.startDate);
  }

  get durationInWords() {
    return formatDistanceStrict(this.endDate, this.startDate);
  }

  get yearRange(): string {
    const [start, end] = [
      this.startDate.getFullYear(),
      this.endDate.getFullYear(),
    ];
    return start === end ? start.toString() : `${start}–${end}`;
  }
}

const entries = [
  new History(
    '1980-04',
    'Brisbane',
    '🇦🇺 Zak springs forth, product of the unholy union between an Aussie and an American.'
  ),
  new History(
    '1984-06',
    'San Diego',
    'Australia cannot contain Zak and his family for long… though he still misses proper fish & chips.'
  ),
  new History(
    '1989-12',
    'Portland',
    '🌲 Clean air and green trees summon him northwards. A blur of school.'
  ),
  new History('1998-04', 'San Diego', 'XXX'),
  new History(
    '2000-01',
    'Washington, DC',
    '️🏛️ Zak kicks off an information security startup and loses faith in anyone’s ability to keep secrets.'
  ),
  new History(
    '2004-05',
    'San Francisco',
    '🌁 Venturing at last into full-time web development, Zak takes a job at Etsy, and later begins consulting.'
  ),
  new History('2008-03', 'Oakland', 'XXX'),
  new History(
    '2010-09',
    'Los Angeles',
    '🌴 Zak joins Bek at GOOD, having been lured back to southern California.'
  ),

  new History(
    '2011-04',
    'Idyllwild',
    '🧗 An excursion to the woods to build Cabin.'
  ),
  new History(
    '2011-10',
    'Portland',
    '🧗 Silicon Forest—home to our favorite espresso, exquisite cuisine, and unstoppable green.'
  ),
  new History(
    '2013-12',
    'Los Angeles',
    'Hello again, sunshine! Some things are just too good not to play on repeat.'
  ),
  new History(
    '2014-11',
    'San Francisco',
    `The verdict is in! San Francisco, we're yours.`
  ),
  new History('2016-08', 'Oakland', 'FLYTRAP'),
];

entries.forEach((e, i) => {
  e.endDate = i < entries.length - 1 ? entries[i + 1].startDate : new Date();
});

export default entries;
