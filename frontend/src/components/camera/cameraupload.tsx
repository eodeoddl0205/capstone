import React, { useRef, useState } from "react";
import { aiQueue } from "../../api";
import { useNavigate } from 'react-router-dom';
import CustomModal from "../customModal";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Camera() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalContent, setModalContent] = useState<string>('');
    const [modalButton, setModalButton] = useState({
        check: {
            text: '',
            view: true
        },
        close: {
            text: '',
            view: true,
            reload: false,
        }
    });

    const [src, setSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ aspect: 1 / 1 });
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const onOpenModal = () => setOpen(true);
    const gotoLogin = () => navigate("/LogIn");

    const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setSrc(reader.result as string));
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const onImageLoaded = (image: HTMLImageElement) => {
        const mutableImageRef = imageRef as React.MutableRefObject<HTMLImageElement>;
        mutableImageRef.current = image;
    };

    const onCropComplete = (crop: Crop) => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop: Crop) => {
        setCrop(crop);
    };

    const makeClientCrop = async (crop: Crop): Promise<void> => {
        if (imageRef.current && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.jpeg"
            );
            setCroppedImageUrl(croppedImageUrl);
        }
    };

    const getCroppedImg = (image: HTMLImageElement, crop: Crop, fileName: string): Promise<string> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        if (crop.width && crop.height) {
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return Promise.reject(new Error('Canvas context is null'));
            }

            ctx.drawImage(
                image,
                crop.x! * scaleX,
                crop.y! * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    // Using `as any` to temporarily bypass TypeScript's type checking for this line
                    (blob as any).name = fileName;
                    window.URL.revokeObjectURL(croppedImageUrl ?? '');
                    const fileUrl = window.URL.createObjectURL(blob);
                    resolve(fileUrl);
                }, 'image/jpeg');
            });
        }

        return Promise.reject(new Error('Crop dimensions are undefined'));
    };

    const handleFileUpload = async (): Promise<void> => {
        if (croppedImageUrl) {
            const file = await fetch(croppedImageUrl).then(r => r.blob()).then(blobFile => new File([blobFile], `aiImage${Math.floor(Math.random() * 9999 + 1)}.jpg`, { type: "image/jpeg" }))
            if (file) {
                aiQueue(file)
                    .then(response => {
                        if (response) {
                            navigate("/ai/wating");
                        };
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 401) {
                            setModalTitle('로그인');
                            setModalContent('정상적인 연결을 위해 로그인 해주세요.');
                            setModalButton({
                                check: {
                                    text: '확인',
                                    view: true
                                },
                                close: {
                                    text: '닫기',
                                    view: true,
                                    reload: false,
                                }
                            });
                            onOpenModal();
                        }
                        if (error) {
                            console.error(error);
                        };
                    })
            }
        } else {
            setModalTitle('이미지');
            setModalContent('로고가 나오도록 이미지를 정사각형으로 잘라주세요.');
            setModalButton({
                check: {
                    text: '확인',
                    view: false
                },
                close: {
                    text: '확인',
                    view: true,
                    reload: false,
                }
            });
            onOpenModal();
        }
    };

    return (
        <div>
            <div>
                <CustomModal
                    title={modalTitle}
                    content={modalContent}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onCofirm={() => gotoLogin()}
                    modalbutton={modalButton}
                />
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={onSelectFile} />
            <div className="w(100%) vpack">
                <div className="vpack gap(40) w(100%) h(100%)">
                    <div className="w(500) h(500~100%) vpack b(1) r(15px) bc(#6e6e6e) @w(~1024):w(400)+h(400~100%) @w(~769):w(280)+h(280~100%)">
                        {src && <div className="vpack w(100%) h(100%) p(35)">
                            <ReactCrop
                                src={src}
                                crop={crop}
                                ruleOfThirds
                                onImageLoaded={onImageLoaded}
                                onComplete={onCropComplete}
                                onChange={onCropChange}
                            />
                        </div>}
                        {src ? <></> : <button onClick={() => fileInputRef.current?.click()} className="file-select-btn vpack w(100%) h(100%)">
                            <span className="c(#4077E4) dark:c(#fff)">로고가 찍힌<div>사진을 올려주세요</div></span>
                        </button>}
                    </div>
                    <button onClick={handleFileUpload} className="p(10/30/10/30) r(20) bg(#4077E4) c(#fff) mb(50) @w(~769):p(10/16/10/16)">AI 불러오기</button>
                </div>
            </div>
        </div>
    );
}
