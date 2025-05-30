import { forwardRef } from 'react';
import { GoPencil } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';

const Kuratoredit = forwardRef(({ variant = "edit", ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="group flex items-center gap-2 px-4 py-2 border bg-white cursor-pointer text-[#800000] hover:border-2 border-white hover:bg-[#800000] hover:text-white transition"
    >
      {variant === "edit" ? (
        <GoPencil className="text-lg text-[#800000] group-hover:text-white transition" />
      ) : (
        <IoMdClose className="text-lg text-[#800000] group-hover:text-white transition" />
      )}
    </button>
  );
});

Kuratoredit.displayName = 'Kuratoredit';

export default Kuratoredit;
