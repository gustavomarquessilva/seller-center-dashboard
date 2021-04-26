import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sell } from '@pages/sells';
import { FiPaperclip } from 'react-icons/fi';
import Tooltip from '@components/Tooltip';

import styles from './styles.module.scss';
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler, useField } from '@unform/core';

interface AttachButtonProps {
  name: string;
  title: string;
  isAttached: boolean;
  unattachedText: string;
  attachedText: string;
  placeholder: string;
  handleAttachment: SubmitHandler<any>;
}

const AttachButton: React.FC<AttachButtonProps> = ({ name, title, placeholder, isAttached, unattachedText, attachedText, handleAttachment }) => {
  const formRef = useRef<FormHandles>(null);

  const [openTooltip, setOpenTooltip] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // const { fieldName, defaultValue, error, registerField } = useField(name);

  // useEffect(() => {
  //   registerField({
  //     name: fieldName,
  //     ref: inputRef.current,
  //     path: '',
  //   });
  // }, [fieldName, registerField]);

  const handleTooltip = useCallback(() => {
    setOpenTooltip(!openTooltip)
  }, [openTooltip]);

  return (
    <div className={styles.container}>
      <button onClick={handleTooltip}>
        <FiPaperclip />
        {isAttached ? <span>{attachedText}</span> : <span>{unattachedText}</span>}
      </button>
      {openTooltip && (
        <Tooltip title={title} closeTooltip={handleTooltip}>
          <Form ref={formRef} onSubmit={handleAttachment}>
            <div className={styles.attachment}>
              <div className={styles.attachmentInput}>
                <FiPaperclip />
                <input name={name} placeholder={placeholder} ref={inputRef} />
              </div>

              <button type='submit'>Confirmar</button>
            </div>
          </Form>
        </Tooltip>
      )}
    </div>
  )
}

export default AttachButton;
