import React from "react";
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

    return (
        <section className='transcript'>
            <div className="header">文字起こし</div>
            {list.map((t, i) => (
                <div className='caption' key={i}>
                    <img className="icon" src='https://yt3.ggpht.com/ytc/AIdro_kLDBK5ksSvk5-XJ6S8e0kWfjy7mVl3jyUkgDeMQ7rlCpU=s88-c-k-c0x00ffffff-no-rj'/>
                    <p class='text'>{t.text}</p>
                </div>
            ))}
        </section>
    )
}