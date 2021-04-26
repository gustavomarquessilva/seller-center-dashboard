import { Input } from '@material-ui/core';
import { useField } from '@unform/core';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiDownload, FiCamera, FiCameraOff, FiAlertCircle } from 'react-icons/fi'

// import './styles.module.css';

interface Props {
  name: string;
  onFileUploaded: (file: File) => void;
  filesUrl: string[];
  setFilesUrl: React.Dispatch<React.SetStateAction<string[]>>;
}

interface InputRefProps extends HTMLInputElement {
  acceptedFiles: string[];
}

// TODO: Passar a lista de imagens para dentro deste componente (externalizar como outro componente se preicsar)
const Dropzone: React.FC<Props> = ({ name, onFileUploaded, filesUrl, setFilesUrl }) => {
  // const [selectedFileUrl, setselectedFileUrl] = useState<string[]>([]);
  const [err, setErr] = useState();

  const dropZoneRef = useRef<InputRefProps>(null);
  const { fieldName, registerField, defaultValue = [], error } = useField(name);

  const onDrop = useCallback(acceptedFiles => {
    setErr(undefined);
    try {
      if (dropZoneRef.current) {
        const file = acceptedFiles[0];

        if (!filesUrl.includes(file)) {
          const fileUrl = URL.createObjectURL(file);

          acceptedFiles = [...filesUrl, fileUrl];
          setFilesUrl([...filesUrl, fileUrl]);
          onFileUploaded(file);
        }
      }

    } catch (err) {
      setErr(err);
      setTimeout(() => {
        setErr(undefined);
      }, 3000);
    }
  }, [onFileUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  })

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: dropZoneRef.current,
      getValue: (ref: InputRefProps) => {
        return ref.acceptedFiles || [];
      },
      clearValue: (ref: InputRefProps) => {
        ref.acceptedFiles = [];
        setFilesUrl([]);
      },
      setValue: (ref: InputRefProps, value) => {
        ref.acceptedFiles = value;
        setFilesUrl(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className='dropzone' {...getRootProps()} onClick={() => dropZoneRef.current?.click()}>
      <input {...getInputProps()} accept='image/*' ref={dropZoneRef} />
      {
        // selectedFileUrl
        //   ?
        //   <img src={selectedFileUrl} alt='Point thumbnail' />
        //   :
        !!err ?
          <p className='error'>
            <FiAlertCircle />
            Erro com o arquivo selecionado
            <br />
            Tente novamente
          </p>
          :
          !!error ?
            <p className='error'>
              <FiAlertCircle />
              {error}
            </p>
            :
            isDragActive ?
              <p>
                <FiCamera />
                Solte o arquivo aqui ...
              </p>
              :
              <p>
                <FiCamera />
                Clique ou arraste
                <br />
                As fotos aqui
              </p>
      }
    </div>
  )
}

export default Dropzone;