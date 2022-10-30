import { Twemoji } from 'react-emoji-render';


export interface EmojifyProps {
  text: string
}

export const Emojify = ({ text }: EmojifyProps) => (
  <Twemoji text={text} onlyEmojiClassName="emoji"/>
)
