export interface PDFText {
    [key:string]: any;
    _id: string;
    text: string;
    font: string;
    fontType: string;
    fontSize: number;
    xPosition: number;
    yPosition: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PDFImage {
    [key:string]: any;
    _id: string;
    imageURL: string;
    height: number;
    width: number;
    xPosition: number;
    yPosition: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type PDFData = {
    [key:string]: any;
    _id: string;
    PDFName: string;
    height: number;
    width: number;
    pageLayout: "portrait" | "landscape";
    orderDefault: boolean;
    stickerDefault: boolean;
    data: Object;
    PDFText: PDFText[];
    PDFImage: PDFImage[];
    createdAt: Date;
    updatedAt: Date;
  }