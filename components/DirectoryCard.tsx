import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props={eyebrow:string;title:string;description:string;meta?:string;href?:string};
export function DirectoryCard({eyebrow,title,description,meta,href}:Props){const body=<article className="directory-card"><div className="eyebrow">{eyebrow}</div><h3>{title}</h3><p>{description}</p><div className="directory-meta"><span>{meta}</span>{href&&<ArrowUpRight size={17}/>}</div></article>;return href?<Link href={href} target={href.startsWith('http')?'_blank':undefined}>{body}</Link>:body}
