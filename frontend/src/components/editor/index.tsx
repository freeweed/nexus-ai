import { useEffect, useRef } from "react";
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Embed from '@editorjs/embed'
// @ts-ignore
import Paragraph from '@editorjs/paragraph'
// @ts-ignore
import Warning from '@editorjs/warning'
// @ts-ignore
import LinkTool from '@editorjs/link'
// @ts-ignore
import SimpleImage from "@editorjs/simple-image";
// @ts-ignore
import Header from '@editorjs/header'
// @ts-ignore
import Quote from '@editorjs/quote'
// @ts-ignore
import CheckList from '@editorjs/checklist'
// @ts-ignore
import Delimiter from '@editorjs/delimiter'

interface EditorProps {
    onContent: (content: object) => void
}

const Editor: React.FC<EditorProps> = ({onContent}: EditorProps) => {
    const initialized = useRef(false)
    const ejInstance: any = useRef(null)

    const EDITOR_JS_TOOLS = {
        paragraph: Paragraph,
        embed: {
            class: Embed,
            config: {
                services: {
                    youtube: true,
                    facebook: true,
                    instagram: true,
                    twitter: true,
                    'twitch-video': true,
                    'twitch-channel': true,
                    miro: true,
                    vimeo: true,
                    codepen: true,
                    pinterest: true,
                    coub: true
                }
            },
            inlineToolbar: true
        },
        warning: Warning,
        linkTool: LinkTool, // need backend
        image: {
            class: SimpleImage,
            inlineToolbar: true
        }, // need backend
        header: Header,
        quote: Quote,
        checklist: CheckList,
        delimiter: Delimiter,
        simpleImage: SimpleImage,
    }

    const initEditor = () => {
        const editor = new EditorJS({
            holder: 'editor',
            placeholder: "Let's write an awesome meeting note!",
            tools: EDITOR_JS_TOOLS,
            onReady: () => {
                ejInstance.current = editor;
            },
            onChange: (api, event) => {
                editor.save().then((content: Record<string, any>) => {
                    onContent(content.blocks)
                }).catch((err: any) => {
                    console.log("error: " + JSON.stringify(err))
                })
            }
        })
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            initEditor()
        }
    }, [])

    return  (
        <div id="editor"></div>
    )
}

export default Editor;