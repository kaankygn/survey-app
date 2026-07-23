function ProfilRozeti({ photo, name, city, ekstra, size = 'md' }) {
    const boyutlar = {
        sm: { img: 'w-7 h-7', text: 'text-xs' },
        md: { img: 'w-8 h-8', text: 'text-sm' },
        lg: { img: 'w-11 h-11', text: 'text-base' }
    }
    const b = boyutlar[size]
    return (
        <div className="flex items-center gap-2.5">
            {photo && <img src={photo} alt="" className={b.img + " rounded-full"} />}
            <span className={b.text + " text-slate-500"}>
                {name}
                {city && ' · ' + city}
                {ekstra && ' · ' + ekstra}
            </span>
        </div>
    )
}

export default ProfilRozeti