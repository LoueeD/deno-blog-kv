export default function Header(data: { backHome: boolean }) {
  return (
    <div class="px-5 mx-[-1px] flex items-center border-lr-1 border-b-1 border-[#393939] text-[1.1rem] min-h-[65px] sticky top-0 bg-[#222] z-50">
      <h1 class="flex">
        {data.backHome && <a href="/"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225L10 22Z"></path></svg></a>}
        {!data.backHome && 'Louis\' Blog'}
      </h1>
    </div>
  )
}

