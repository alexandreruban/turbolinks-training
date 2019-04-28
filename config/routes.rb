Rails.application.routes.draw do
  root to: "pages#home"
  get "/about", to: "pages#about"
  get "/flunk", to: "pages#flunk"
end
