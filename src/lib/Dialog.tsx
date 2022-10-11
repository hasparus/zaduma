/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { JSX, Ref } from "solid-js";

export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  children: JSX.Element;
  ref?: Ref<HTMLDialogElement>;
}

export function Dialog(props: DialogProps) {
  const dismissOnBackdropClick: JSX.EventHandler<
    HTMLDialogElement,
    MouseEvent
  > = (event) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close("dismiss");
    }
  };

  return (
    <dialog
      onClick={dismissOnBackdropClick}
      ref={props.ref!}
      class={
        "backdrop:bg-white backdrop:bg-opacity-25" +
        " mx-auto transform rounded-xl bg-white bg-opacity-75" +
        " divide-y divide-gray-500 divide-opacity-10" +
        " overflow-hidden shadow-2xl ring-1 ring-black ring-opacity-5" +
        " backdrop-blur backdrop-filter transition-all"
      }
    >
      <form method="dialog">
        <button value="cancel">Cancel</button>
        <button value="default">Confirm</button>
      </form>
    </dialog>
  );
}

// import { Dialog, Transition } from "@headlessui/react";
// import { cx } from "cva";
// import { forwardRef, Fragment, ReactNode } from "react";

// export interface ModalProps {
//   open: boolean;
//   afterLeave?: () => void;
//   onClose: () => void;
//   children: ReactNode;
// }

// export function Modal({ open, afterLeave, onClose, children }: ModalProps) {
//   return (
//     <Transition.Root show={open} as={Fragment} afterLeave={afterLeave} appear>
//       <Dialog as="div" className="relative z-10" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-white bg-opacity-25 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             {children}
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }

// export interface ModalPanelProps {
//   children: React.ReactNode;
//   className?: string;
// }

// Modal.Panel = forwardRef<HTMLDivElement, ModalPanelProps>(
//   ({ children, className }, ref) => {
//     return (
//       <Dialog.Panel
//         ref={ref}
//         className={cx(
//           "mx-auto transform divide-y divide-gray-500 divide-opacity-10 overflow-hidden rounded-xl bg-white bg-opacity-75 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all",
//           className
//         )}
//       >
//         {children}
//       </Dialog.Panel>
//     );
//   }
// );

// Modal.Title = Dialog.Title;
