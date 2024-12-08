import { useNavigate } from "react-router-dom";

const category = [
    {
        image: 'https://firebasestorage.googleapis.com/v0/b/momentos-eternos-5e14f.appspot.com/o/icon1.jpg?alt=media&token=ed1da11e-5b3a-403d-9bd9-f58e9b7ff9f9',
        name: 'Ramos Eternos'
    },
    {
        image: 'https://firebasestorage.googleapis.com/v0/b/momentos-eternos-5e14f.appspot.com/o/icon2.jpg?alt=media&token=2d353baa-38da-49e7-956e-575d284329a9',
        name: 'Amigurumis'
    }
]

const Category = () => {
    const navigate = useNavigate();
    return(
        <div>
            <div className="flex flex-col mt-5">
                <div className="flex overflow-x-scroll lg:justify-center hide-scroll-bar">
                    <div className="flex">
                        {category.map((item, index) => {
                            return (
                                <div key={index} className="px-3 lg:px-10">
                                    <div onClick={() => navigate(`/category/${item.name}`)} className="w-16 h-16 lg:w-24 lg:h-24 max-w-xs rounded-full bg-pink-500 transition-all hover:bg-pink-400 cursor-pointer mb-1 flex items-center justify-center">
                                        <img src={item.image} alt="img" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <h1 className="text-sm lg:text-lg text-center font-medium title-font text-black first-letter:uppercase">{item.name}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: ".hide-scroll-bar { -ms-overflow-style: none; scrollbar-width: none;}.hide-scroll-bar::-webkit-scrollbar { display: none;}" }} />
        </div>
    )
}

export default Category;
