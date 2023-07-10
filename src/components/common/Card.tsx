import React from 'react'
import Button from './Button'
import Image from 'next/image'
import { TEXT_CONSTANTS } from '@/Constants/constants';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import CardTooltip from './../Modals/CardTooltip.Modal';
import { toggleTooltip } from '@/store/uiSlice';
import { ColumnType, IExpert, IObject, convertObjectToCardData } from '@/Types/Interfaces';

interface CardProps {
    title: string;
    buttonText: string;
    columns: ColumnType[];
    items: convertObjectToCardData[] | undefined;
    statusRenderer?: (item: convertObjectToCardData) => React.ReactElement | undefined
    onClick: () => void,
    type: string
}

const Card: React.FC<CardProps> = ({ title, buttonText, columns, items, statusRenderer, onClick, type }) => {
    const gridTemplateColumns = columns.map(column => column.width).join(' ');

    const dispatch = useDispatch()

    const openedTooltipIndex = useSelector((state: RootState) => state.ui.openedTooltipIndex);

    return (
        <div className="basis-full lg:basis-1/4 lg:mr-5 lg:h-96">
            <div className='flex items-center justify-between gap-3'>
                <div className="hidden lg:flex lg:items-center lg:gap-2">
                    <h3 className="lg:block font-light tracking-widest">{title}</h3>
                    <Image className='hover:scale-110 cursor-pointer' src={'/hint.svg'} width={18} height={18} alt="hint" />
                </div>
                <Button onClick={onClick} className='w-full bg-main-primary my-4 py-3 rounded-lg shadow-hover lg:block lg:w-fit lg:px-4 lg:bg-main-secondary lg:py-2 hover:shadow-lg hover:shadow-main-secondary/25'>
                    <p className='md:text-md lg:text-sm lg:tracking-widest font-light'>Add</p>
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 my-2 pr-1" style={{ gridTemplateColumns }}>
                {columns.map(column => (
                    <div key={column.title} className="font-bold lg:text-xs text-neutral-secondary"><p className=' font-extralight tracking-widest'>{column.title}</p></div>
                ))}
            </div>
            <ul className="h-80 overflow-auto pr-4 lg:pr-2">
                {items && items.map((item, index) => (
                    <li key={item.id} className="my-2 border-b-main-secondary border-b py-2">
                        <p className="hidden">{item.id}</p>
                        <div className="grid grid-cols-4 gap-4 items-center" style={{ gridTemplateColumns }}>
                            {item.columns.map((value, idx) => (
                                <React.Fragment key={idx}>
                                    {columns[idx].type === 'status' && statusRenderer ? statusRenderer(item) :
                                        <p className="tracking-wider lg:text-sm font-light">{value}</p>}
                                </React.Fragment>
                            ))}
                            <div className='relative' onClick={(e) => { e.stopPropagation(); dispatch(toggleTooltip(item.id)) }}>
                                <Image className="hover:bg-neutral-tertiary rounded-lg cursor-pointer" src={'/edit.svg'} width={24} height={24} alt="edit" />
                                {openedTooltipIndex === item.id && <CardTooltip id={item.id} type={type} element={item.object} />}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex items-baseline gap-x-2 mt-4">
                <h4 className="text-neutral-secondary uppercase text-lg lg:text-xs font-light tracking-[.25em]">{TEXT_CONSTANTS.AMOUNT}</h4><h2>{items ? items.length : '0'}</h2>
            </div>
        </div>
    )
}

export default Card;