import React, { useEffect } from "react";
import 'components/Transcript.css';

export default function Transcript() {
    const rawText = `
空っぽのサイレン
乾いた施錠音(せじょうおと)
ガラガラスケーター 
賑わえ三点リーダ
どんな言葉にも ちゃんと 
綻びがあった
もう 何も言わずに
遊ぼう(遊ぼう)

どうでもいい朝に 慣れ過ぎて 傘は持ってない 借りてた未来 返しきれず かわしきれずからがら まちゆく余所者

ねえ ねえ 独りだ 肩触れたのは メイビー、レイニー 君はとうにいないんだね かなしくはないよ 嬉しくもないよ メイビー、レイニー よく晴れた鈍色に 減点式の舗装路を染める レイニー、レイニー こんな間違えたんだね 塗りつぶしてゆくパノラマ レイニー、レイニー 君は何点だったの

バイバイ バイバイ 
よく晴れた鈍色のしょうご
    `;

    // split by line breaks and trim
    const list = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) // remove empty lines
        .map(line => ({ name: 'Sui', text: line }));

    const expand = (i) => {
        const container = document.querySelector('.transcript');
        const el = document.getElementsByClassName('caption')[i];
        const header = container.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;

        container.scrollTo({
            top: el.offsetTop - headerHeight, // align caption under header
            behavior: 'smooth'
        });

        setTimeout(() => {
            el.classList.add('expanded');
        }, 200);
    };

    const [containerHeight, setContainerHeight] = React.useState(0);

    useEffect(() => {
        // Scroll to top when component mounts
        const container = document.querySelector('.transcript');
        const el = document.getElementsByClassName('caption')[list.length - 1];
        const header = container.querySelector('.header');
        setContainerHeight(container.offsetHeight - el.offsetHeight - header.offsetHeight);
    }, []);
    
    return (
        <section className='transcript'>
            <div className="header">文字起こし</div>
            {list.map((t, i) => (
                <div className='caption' key={i} onClick={() => {expand(i);}}>
                    <img className="icon" src='https://yt3.ggpht.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s88-c-k-c0x00ffffff-no-rj'/>
                    <p class='text'>{t.text}</p>
                </div>
            ))}
            <div className="filler" style={{"height": containerHeight + 'px'}}></div>
        </section>
    )
}