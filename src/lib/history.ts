import differenceInDays from 'date-fns/differenceInDays/index.js';
import formatDistanceStrict from 'date-fns/formatDistanceStrict/index.js';
import parse from 'date-fns/parse/index.js';

export class History {
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

export const entries = `
1980-04: Brisbane
XXX
🇦🇺 Zak springs forth, product of the unholy union between an Aussie and an American.
I was born in Australia to an American father and an Australian/English mother.

1984-06: San Diego
Australia cannot contain Zak and his family for long… though he still misses proper fish & chips.

1989-12: Portland
When my parents split, I moved northwards with Mum. Technically, I was living in
Vancouver, WA–a small suburb of Portland with not much else going for it.

1998-04: San Diego
Back to San Diego, to spend some time with my dad and engage in a brief tryst
with higher education.

2000-01: Washington, DC
I dropped out of school to move to the east coast, kicking off an information
security startup and thereby losing faith in anyone's ability to keep secrets.

2004-05: San Francisco
After realizing that the parts of my job I loved most involved automating myself
away, I pivoted into full-time web development. I started working at
<a href="https://www.etsy.com/">Etsy</a>, and later began consulting.

2008-03: Oakland
XXX

2010-09: Los Angeles
🌴 Zak joins Bek at GOOD, having been lured back to southern California.

2011-04: Idyllwild
🧗 An excursion to the woods to build Cabin.

2011-10: Portland
🌲 Clean air and green trees summon him northwards. A blur of school.
🧗 Silicon Forest—home to our favorite espresso, exquisite cuisine, and unstoppable green.

2013-12: Los Angeles
Hello again, sunshine! Some things are just too good not to play on repeat.

2014-11: San Francisco
The verdict is in! San Francisco, we're yours.

2016-08: Oakland
FLYTRAP
`
  .trim()
  .split(/\n\n+/)
  .map((s) => {
    const lines = s.split('\n');
    const [date, place] = lines[0].split(': ');
    const description = lines.slice(1).join('\n').trim();
    return new History(date, place, description);
  });

entries.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
entries.forEach((e, i) => {
  e.endDate = entries[i + 1]?.startDate || new Date();
});
