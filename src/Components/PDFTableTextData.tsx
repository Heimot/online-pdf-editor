import React, { useState, useEffect } from 'react'
import { Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './PDFStyles.css';
import { PDFText, Fonts, GetFonts } from '../model';

interface Props {
    text: PDFText;
    fonts: Fonts[];
    getFonts: GetFonts;
    removeTextData: (_id: string) => void;
    updateTextData: (_id: string, text: string, font: string, fontType: string, fontSize: number, xPosition: number, yPosition: number) => void;
}

interface TextArr {
    _id: string;
    text: string;
    Font: string;
    FontType: string;
    FontSize: number;
    XPosition: number;
    YPosition: number;
}

const PDFTableTextData: React.FC<Props> = ({ text, fonts, getFonts, removeTextData, updateTextData }) => {
    const [textData, setTextData] = useState<TextArr>({ _id: text._id, text: text.text, Font: text.font, FontType: text.fontType, FontSize: text.fontSize, XPosition: text.xPosition, YPosition: text.yPosition })
    const [fontTypes, setFontTypes] = useState<string[]>()

    useEffect(() => {
        if (textData._id === null) return;
        updateTextData(textData._id, textData.text, textData.Font, textData.FontType, textData.FontSize, textData.XPosition, textData.YPosition)
        setFontTypes(getFonts[textData.Font])
    }, [textData])

    const handleChange = (value: string | number, name: string) => {
        setTextData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const getFontTypes = () => {
        if (!fontTypes) return;
        let data = [];
        for (let i = 0; i < fontTypes?.length; i++) {
            //console.log(fontTypes)
            data.push(<option key={i}>{fontTypes[i]}</option>)
        }
        return data;
    }

    return (
        <Tr>
            <Td><input name='text' value={textData.text} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td>
                <select value={textData.Font.toString()} name='Font' onChange={(e) => { handleChange(e.target.value, e.target.name); setFontTypes(getFonts[e.target.value]); }}>
                    {
                        fonts.map((font) => {
                            return <option key={font.name}>{font.name}</option>
                        })
                    }
                </select>
            </Td>
            <Td><input name='FontSize' value={textData.FontSize} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td>
                <select name='FontType' value={textData.FontType.toString()} onChange={(e) => handleChange(e.target.value, e.target.name)}>
                    {getFontTypes()}
                </select>
            </Td>
            <Td><input name='XPosition' value={textData.XPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td>
                <input name='YPosition' value={textData.YPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input>
                <button onClick={() => removeTextData(textData._id)}>x</button>
            </Td>
        </Tr>
    )
}

export default PDFTableTextData