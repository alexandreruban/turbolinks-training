class PagesController < ApplicationController
  def home
    sleep(1)
  end

  def about
  end

  def flunk
    raise
  end
end
