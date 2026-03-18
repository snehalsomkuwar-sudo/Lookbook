function ColorSwatch() {
  return (
    <div className="bg-[#eb595f] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #EB595F
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary 100
      </p>
    </div>
  );
}

function ColorToken() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        primary-default
      </p>
      <ColorSwatch />
    </div>
  );
}

function ColorSwatch1() {
  return (
    <div className="bg-[#fdeeef] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#bc474c] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FDEEEF
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary L10
      </p>
    </div>
  );
}

function ColorToken1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        primary-variant
      </p>
      <ColorSwatch1 />
    </div>
  );
}

function ColorSwatch2() {
  return (
    <div className="bg-[#bc474c] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #BC474C
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary D80
      </p>
    </div>
  );
}

function ColorToken2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        primary-hover
      </p>
      <ColorSwatch2 />
    </div>
  );
}

function ColorSwatch3() {
  return (
    <div className="bg-[#fbdedf] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#bc474c] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FBDEDF
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary L20
      </p>
    </div>
  );
}

function ColorToken3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        primary-variant-hover
      </p>
      <ColorSwatch3 />
    </div>
  );
}

function ColorTokens() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken />
      <ColorToken1 />
      <ColorToken2 />
      <ColorToken3 />
    </div>
  );
}

function TokenGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">primary</p>
      <ColorTokens />
    </div>
  );
}

function ColorSwatch4() {
  return (
    <div className="bg-[#5e455a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #5E455A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Secondary 100
      </p>
    </div>
  );
}

function ColorToken4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        secondary-default
      </p>
      <ColorSwatch4 />
    </div>
  );
}

function ColorSwatch5() {
  return (
    <div className="bg-[#efecef] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#42303f] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #EFECEF
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Secondary L10
      </p>
    </div>
  );
}

function ColorToken5() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        secondary-variant
      </p>
      <ColorSwatch5 />
    </div>
  );
}

function ColorTokens1() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken4 />
      <ColorToken5 />
    </div>
  );
}

function TokenGroup1() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">secondary</p>
      <ColorTokens1 />
    </div>
  );
}

function ColorSwatch6() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#1a1a1a] text-[14px] w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#1a1a1a] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L0
      </p>
    </div>
  );
}

function ColorToken6() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        surface-default
      </p>
      <ColorSwatch6 />
    </div>
  );
}

function ColorSwatch7() {
  return (
    <div className="bg-[#e6e6e6] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #E6E6E6
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L10
      </p>
    </div>
  );
}

function ColorToken7() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        surface-variant
      </p>
      <ColorSwatch7 />
    </div>
  );
}

function ColorSwatch8() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F2F2F2
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L5
      </p>
    </div>
  );
}

function ColorToken8() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        surface-bg
      </p>
      <ColorSwatch8 />
    </div>
  );
}

function ColorTokens2() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken6 />
      <ColorToken7 />
      <ColorToken8 />
    </div>
  );
}

function TokenGroup2() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">surface</p>
      <ColorTokens2 />
    </div>
  );
}

function ColorSwatch9() {
  return (
    <div className="bg-[#db382a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#fdeeef] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #DB382A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Red 100
      </p>
    </div>
  );
}

function ColorToken9() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-red-default
      </p>
      <ColorSwatch9 />
    </div>
  );
}

function ColorSwatch10() {
  return (
    <div className="bg-[#f8d7d4] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#af2d22] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F8D7D4
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Red L20
      </p>
    </div>
  );
}

function ColorToken10() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-red-variant1
      </p>
      <ColorSwatch10 />
    </div>
  );
}

function ColorTokens4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken10 />
    </div>
  );
}

function ColorSwatch11() {
  return (
    <div className="bg-[#fbebea] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#af2d22] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FBEBEA
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Red L10
      </p>
    </div>
  );
}

function ColorToken11() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-red-variant2
      </p>
      <ColorSwatch11 />
    </div>
  );
}

function ColorTokens5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken11 />
    </div>
  );
}

function ColorTokens3() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken9 />
      <ColorTokens4 />
      <ColorTokens5 />
    </div>
  );
}

function TokenGroup3() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">tertiary-red</p>
      <ColorTokens3 />
    </div>
  );
}

function ColorSwatch12() {
  return (
    <div className="bg-[#469e59] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #469E59
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Green 100
      </p>
    </div>
  );
}

function ColorToken12() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-green-default
      </p>
      <ColorSwatch12 />
    </div>
  );
}

function ColorSwatch13() {
  return (
    <div className="bg-[#daecde] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#387e47] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #DAECDE
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Green L20
      </p>
    </div>
  );
}

function ColorToken13() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-green-variant1
      </p>
      <ColorSwatch13 />
    </div>
  );
}

function ColorSwatch14() {
  return (
    <div className="bg-[#edf5ee] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#387e47] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #EDF5EE
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Green L10
      </p>
    </div>
  );
}

function ColorToken14() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-green-variant2
      </p>
      <ColorSwatch14 />
    </div>
  );
}

function ColorTokens6() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken12 />
      <ColorToken13 />
      <ColorToken14 />
    </div>
  );
}

function TokenGroup4() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">tertiary-green</p>
      <ColorTokens6 />
    </div>
  );
}

function ColorSwatch15() {
  return (
    <div className="bg-[#4e58b4] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #4E58B4
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Blue 100
      </p>
    </div>
  );
}

function ColorToken15() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-blue-default
      </p>
      <ColorSwatch15 />
    </div>
  );
}

function ColorSwatch16() {
  return (
    <div className="bg-[#dcdef0] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#3e4690] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #DCDEF0
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Blue L20
      </p>
    </div>
  );
}

function ColorToken16() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-blue-variant1
      </p>
      <ColorSwatch16 />
    </div>
  );
}

function ColorSwatch17() {
  return (
    <div className="bg-[#edeef7] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#3e4690] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #EDEEF7
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Blue L10
      </p>
    </div>
  );
}

function ColorToken17() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-blue-variant2
      </p>
      <ColorSwatch17 />
    </div>
  );
}

function ColorTokens7() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken15 />
      <ColorToken16 />
      <ColorToken17 />
    </div>
  );
}

function TokenGroup5() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">tertiary-blue</p>
      <ColorTokens7 />
    </div>
  );
}

function ColorSwatch18() {
  return (
    <div className="bg-[#f19e2b] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F19E2B
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Yellow 100
      </p>
    </div>
  );
}

function ColorToken18() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-yellow-default
      </p>
      <ColorSwatch18 />
    </div>
  );
}

function ColorSwatch19() {
  return (
    <div className="bg-[#fcecd5] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#c17e22] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FCECD5
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Yellow L20
      </p>
    </div>
  );
}

function ColorToken19() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-yellow-variant1
      </p>
      <ColorSwatch19 />
    </div>
  );
}

function ColorSwatch20() {
  return (
    <div className="bg-[#fef5ea] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#c17e22] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FEF5EA
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Yellow L10
      </p>
    </div>
  );
}

function ColorToken20() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        tertiary-yellow-variant2
      </p>
      <ColorSwatch20 />
    </div>
  );
}

function ColorTokens8() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken18 />
      <ColorToken19 />
      <ColorToken20 />
    </div>
  );
}

function TokenGroup6() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">tertiary-yellow</p>
      <ColorTokens8 />
    </div>
  );
}

function ColorSwatch21() {
  return (
    <div className="bg-[#333] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#f2f2f2] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #333333
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L80
      </p>
    </div>
  );
}

function ColorToken21() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        inverse-surface-default
      </p>
      <ColorSwatch21 />
    </div>
  );
}

function ColorSwatch22() {
  return (
    <div className="bg-[#bc474c] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#f9cdcf] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #BC474C
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary D80
      </p>
    </div>
  );
}

function ColorToken22() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        inverse-surface-primary
      </p>
      <ColorSwatch22 />
    </div>
  );
}

function ColorTokens9() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken21 />
      <ColorToken22 />
    </div>
  );
}

function TokenGroup7() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">inverse-surface</p>
      <ColorTokens9 />
    </div>
  );
}

function ColorSwatch23() {
  return (
    <div className="bg-[#f8e3da] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F8E3DA
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Biege
      </p>
    </div>
  );
}

function ColorToken23() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-biege-default
      </p>
      <ColorSwatch23 />
    </div>
  );
}

function ColorTokens10() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken23 />
    </div>
  );
}

function TokenGroup8() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-1</p>
      <ColorTokens10 />
    </div>
  );
}

function ColorSwatch24() {
  return (
    <div className="bg-[#daebf4] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #DAEBF4
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Blue
      </p>
    </div>
  );
}

function ColorToken24() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-blue-default
      </p>
      <ColorSwatch24 />
    </div>
  );
}

function ColorTokens11() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken24 />
    </div>
  );
}

function TokenGroup9() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-2</p>
      <ColorTokens11 />
    </div>
  );
}

function ColorSwatch25() {
  return (
    <div className="bg-[#cee4da] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #CEE4DA
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Green
      </p>
    </div>
  );
}

function ColorToken25() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-green-default
      </p>
      <ColorSwatch25 />
    </div>
  );
}

function ColorTokens12() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken25 />
    </div>
  );
}

function TokenGroup10() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-3</p>
      <ColorTokens12 />
    </div>
  );
}

function ColorSwatch26() {
  return (
    <div className="bg-[#ffebc2] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFEBC2
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Mustard
      </p>
    </div>
  );
}

function ColorToken26() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-mustard-default
      </p>
      <ColorSwatch26 />
    </div>
  );
}

function ColorTokens13() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken26 />
    </div>
  );
}

function TokenGroup11() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-4</p>
      <ColorTokens13 />
    </div>
  );
}

function ColorSwatch27() {
  return (
    <div className="bg-[#5f2356] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #5F2356
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Extended 1
      </p>
    </div>
  );
}

function ColorToken27() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-5-default
      </p>
      <ColorSwatch27 />
    </div>
  );
}

function ColorTokens14() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken27 />
    </div>
  );
}

function TokenGroup12() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-5</p>
      <ColorTokens14 />
    </div>
  );
}

function ColorSwatch28() {
  return (
    <div className="bg-[#ffdd64] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFEBC2
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Extended 2
      </p>
    </div>
  );
}

function ColorToken28() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        extended-6-default
      </p>
      <ColorSwatch28 />
    </div>
  );
}

function ColorTokens15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken28 />
    </div>
  );
}

function TokenGroup13() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">extended-6</p>
      <ColorTokens15 />
    </div>
  );
}

function ColorSwatch29() {
  return (
    <div className="bg-[rgba(0,0,0,0.2)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.2);
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 20P
      </p>
    </div>
  );
}

function ColorToken29() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        overlay-20p
      </p>
      <ColorSwatch29 />
    </div>
  );
}

function ColorSwatch30() {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.4);
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 40P
      </p>
    </div>
  );
}

function ColorToken30() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        overlay-40p
      </p>
      <ColorSwatch30 />
    </div>
  );
}

function ColorSwatch31() {
  return (
    <div className="bg-[rgba(0,0,0,0.6)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.6);
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 60P
      </p>
    </div>
  );
}

function ColorToken31() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        overlay-60p
      </p>
      <ColorSwatch31 />
    </div>
  );
}

function ColorTokens16() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken29 />
      <ColorToken30 />
      <ColorToken31 />
    </div>
  );
}

function TokenGroup14() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">overlay</p>
      <ColorTokens16 />
    </div>
  );
}

function ColorSwatch32() {
  return (
    <div className="bg-[rgba(0,0,0,0.04)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.04);
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 04P
      </p>
    </div>
  );
}

function ColorToken32() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        hover-04p
      </p>
      <ColorSwatch32 />
    </div>
  );
}

function ColorSwatch33() {
  return (
    <div className="bg-[rgba(0,0,0,0.08)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.08);
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 08P
      </p>
    </div>
  );
}

function ColorToken33() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        hover-08p
      </p>
      <ColorSwatch33 />
    </div>
  );
}

function ColorSwatch34() {
  return (
    <div className="bg-[rgba(0,0,0,0.12)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.12);
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 12P
      </p>
    </div>
  );
}

function ColorToken34() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        hover-12p
      </p>
      <ColorSwatch34 />
    </div>
  );
}

function ColorSwatch35() {
  return (
    <div className="bg-[rgba(0,0,0,0.16)] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        rgba(0, 0, 0, 0.16);
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral 16P
      </p>
    </div>
  );
}

function ColorToken35() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        hover-16p
      </p>
      <ColorSwatch35 />
    </div>
  );
}

function ColorTokens17() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken32 />
      <ColorToken33 />
      <ColorToken34 />
      <ColorToken35 />
    </div>
  );
}

function TokenGroup15() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">hover</p>
      <ColorTokens17 />
    </div>
  );
}

function Set() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0" data-name="Set 1">
      <TokenGroup />
      <TokenGroup1 />
      <TokenGroup2 />
      <TokenGroup3 />
      <TokenGroup4 />
      <TokenGroup5 />
      <TokenGroup6 />
      <TokenGroup7 />
      <TokenGroup8 />
      <TokenGroup9 />
      <TokenGroup10 />
      <TokenGroup11 />
      <TokenGroup12 />
      <TokenGroup13 />
      <TokenGroup14 />
      <TokenGroup15 />
    </div>
  );
}

function ColorSwatch36() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#eb595f] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#eb595f] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary L0
      </p>
    </div>
  );
}

function ColorToken36() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-primary-default
      </p>
      <ColorSwatch36 />
    </div>
  );
}

function ColorSwatch37() {
  return (
    <div className="bg-[#bc474c] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#fdeeef] w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #BC474C
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary D80
      </p>
    </div>
  );
}

function ColorToken37() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-primary-variant
      </p>
      <ColorSwatch37 />
    </div>
  );
}

function ColorTokens18() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken36 />
      <ColorToken37 />
    </div>
  );
}

function TokenGroup16() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-primary</p>
      <ColorTokens18 />
    </div>
  );
}

function ColorSwatch38() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5e455a] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5e455a] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Secondary L0
      </p>
    </div>
  );
}

function ColorToken38() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-secondary-default
      </p>
      <ColorSwatch38 />
    </div>
  );
}

function ColorSwatch39() {
  return (
    <div className="bg-[#42303f] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#efecef] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #42303F
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Secondary D70
      </p>
    </div>
  );
}

function ColorToken39() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-secondary-variant
      </p>
      <ColorSwatch39 />
    </div>
  );
}

function ColorTokens19() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken38 />
      <ColorToken39 />
    </div>
  );
}

function TokenGroup17() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-secondary</p>
      <ColorTokens19 />
    </div>
  );
}

function ColorSwatch40() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken40() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-surface-default
      </p>
      <ColorSwatch40 />
    </div>
  );
}

function ColorSwatch41() {
  return (
    <div className="bg-[#666] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-white w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #666666
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L60
      </p>
    </div>
  );
}

function ColorToken41() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-surface-secondary
      </p>
      <ColorSwatch41 />
    </div>
  );
}

function ColorSwatch42() {
  return (
    <div className="bg-[#999] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #999999
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L40
      </p>
    </div>
  );
}

function ColorToken42() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-surface-disabled
      </p>
      <ColorSwatch42 />
    </div>
  );
}

function ColorSwatch43() {
  return (
    <div className="bg-[#ccc] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#1a1a1a] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #CCCCCC
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L20
      </p>
    </div>
  );
}

function ColorToken43() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-surface-border
      </p>
      <ColorSwatch43 />
    </div>
  );
}

function ColorTokens20() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken40 />
      <ColorToken41 />
      <ColorToken42 />
      <ColorToken43 />
    </div>
  );
}

function TokenGroup18() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-surface</p>
      <ColorTokens20 />
    </div>
  );
}

function ColorSwatch44() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#db382a] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#db382a] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Red L0
      </p>
    </div>
  );
}

function ColorToken44() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-red-default
      </p>
      <ColorSwatch44 />
    </div>
  );
}

function ColorSwatch45() {
  return (
    <div className="bg-[#af2d22] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#fbebea] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        #AF2D22
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#fbebea] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Red D80
      </p>
    </div>
  );
}

function ColorToken45() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-red-variant
      </p>
      <ColorSwatch45 />
    </div>
  );
}

function ColorTokens21() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken44 />
      <ColorToken45 />
    </div>
  );
}

function TokenGroup19() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-tertiary-red</p>
      <ColorTokens21 />
    </div>
  );
}

function ColorSwatch46() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#469e59] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#469e59] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Green L0
      </p>
    </div>
  );
}

function ColorToken46() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-green-default
      </p>
      <ColorSwatch46 />
    </div>
  );
}

function ColorSwatch47() {
  return (
    <div className="bg-[#387e47] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#edf5ee] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #387E47
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Green D80
      </p>
    </div>
  );
}

function ColorToken47() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-green-variant
      </p>
      <ColorSwatch47 />
    </div>
  );
}

function ColorTokens22() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken46 />
      <ColorToken47 />
    </div>
  );
}

function TokenGroup20() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-tertiary-green</p>
      <ColorTokens22 />
    </div>
  );
}

function ColorSwatch48() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4e58b4] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4e58b4] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Blue L0
      </p>
    </div>
  );
}

function ColorToken48() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-blue-default
      </p>
      <ColorSwatch48 />
    </div>
  );
}

function ColorSwatch49() {
  return (
    <div className="bg-[#3e4690] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#edeef7] w-[180px]" data-name="Color Swatch">
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #3E4690
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Blue D80
      </p>
    </div>
  );
}

function ColorToken49() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-blue-variant
      </p>
      <ColorSwatch49 />
    </div>
  );
}

function ColorTokens23() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken48 />
      <ColorToken49 />
    </div>
  );
}

function TokenGroup21() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-tertiary-blue</p>
      <ColorTokens23 />
    </div>
  );
}

function ColorSwatch50() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#dadada] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#f19e2b] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        #FFFFFF
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#f19e2b] text-[14px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Yellow L0
      </p>
    </div>
  );
}

function ColorToken50() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-yellow-default
      </p>
      <ColorSwatch50 />
    </div>
  );
}

function ColorSwatch51() {
  return (
    <div className="bg-[#c17e22] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#fef5ea] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #C17E22
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tertiary Yellow D80
      </p>
    </div>
  );
}

function ColorToken51() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-tertiary-yellow-variant
      </p>
      <ColorSwatch51 />
    </div>
  );
}

function ColorTokens24() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Color tokens">
      <ColorToken50 />
      <ColorToken51 />
    </div>
  );
}

function TokenGroup22() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-tertiary-yellow</p>
      <ColorTokens24 />
    </div>
  );
}

function ColorSwatch52() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#333] w-[180px] whitespace-pre-wrap" data-name="Color Swatch">
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F2F2F2
      </p>
      <p className="relative shrink-0 w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L5
      </p>
    </div>
  );
}

function ColorToken52() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-inverse-surface-default
      </p>
      <ColorSwatch52 />
    </div>
  );
}

function ColorSwatch53() {
  return (
    <div className="bg-[#f9cdcf] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#bc474c] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #F9CDCF
      </p>
      <p className="min-w-full relative shrink-0 w-[min-content] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Primary L30
      </p>
    </div>
  );
}

function ColorToken53() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-inverse-surface-primary
      </p>
      <ColorSwatch53 />
    </div>
  );
}

function ColorTokens25() {
  return (
    <div className="content-stretch flex font-['Roboto:Regular',sans-serif] font-normal gap-[20px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color tokens">
      <ColorToken52 />
      <ColorToken53 />
    </div>
  );
}

function TokenGroup23() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-inverse-surface</p>
      <ColorTokens25 />
    </div>
  );
}

function ColorSwatch54() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#f8e3da] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken54() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-biege-default
      </p>
      <ColorSwatch54 />
    </div>
  );
}

function ColorTokens26() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken54 />
    </div>
  );
}

function TokenGroup24() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-1</p>
      <ColorTokens26 />
    </div>
  );
}

function ColorSwatch55() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#daebf4] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken55() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-blue-default
      </p>
      <ColorSwatch55 />
    </div>
  );
}

function ColorTokens27() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken55 />
    </div>
  );
}

function TokenGroup25() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-2</p>
      <ColorTokens27 />
    </div>
  );
}

function ColorSwatch56() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#cee4da] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken56() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-green-default
      </p>
      <ColorSwatch56 />
    </div>
  );
}

function ColorTokens28() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken56 />
    </div>
  );
}

function TokenGroup26() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-3</p>
      <ColorTokens28 />
    </div>
  );
}

function ColorSwatch57() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#ffebc2] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken57() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-mustard-default
      </p>
      <ColorSwatch57 />
    </div>
  );
}

function ColorTokens29() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken57 />
    </div>
  );
}

function TokenGroup27() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-4</p>
      <ColorTokens29 />
    </div>
  );
}

function ColorSwatch58() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 w-[180px]" data-name="Color Swatch">
      <div aria-hidden="true" className="absolute border border-[#ccc] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5f2356] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5f2356] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken58() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0" data-name="Color token">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-5-default
      </p>
      <ColorSwatch58 />
    </div>
  );
}

function ColorTokens30() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken58 />
    </div>
  );
}

function TokenGroup28() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-5</p>
      <ColorTokens30 />
    </div>
  );
}

function ColorSwatch59() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-col gap-[10px] h-[120px] items-start p-[16px] relative rounded-[4px] shrink-0 text-[#ffdd64] w-[180px]" data-name="Color Swatch">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        #1A1A1A
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Neutral L90
      </p>
    </div>
  );
}

function ColorToken59() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] relative shrink-0 text-[14px]" data-name="Color token">
      <p className="relative shrink-0 text-black" style={{ fontVariationSettings: "'wdth' 100" }}>
        on-extended-6-default
      </p>
      <ColorSwatch59 />
    </div>
  );
}

function ColorTokens31() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Color tokens">
      <ColorToken59 />
    </div>
  );
}

function TokenGroup29() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Token group">
      <p className="font-['Gilroy:Bold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#212121] text-[28px]">on-extended-6</p>
      <ColorTokens31 />
    </div>
  );
}

function Set1() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0" data-name="Set 2">
      <TokenGroup16 />
      <TokenGroup17 />
      <TokenGroup18 />
      <TokenGroup19 />
      <TokenGroup20 />
      <TokenGroup21 />
      <TokenGroup22 />
      <TokenGroup23 />
      <TokenGroup24 />
      <TokenGroup25 />
      <TokenGroup26 />
      <TokenGroup27 />
      <TokenGroup28 />
      <TokenGroup29 />
    </div>
  );
}

export default function FoundationsColors() {
  return (
    <div className="bg-white content-stretch flex gap-[80px] items-start p-[80px] relative size-full" data-name="Foundations / Colors">
      <Set />
      <Set1 />
    </div>
  );
}