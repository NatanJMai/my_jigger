class Admin::ItemsController < ApplicationController
  before_action :load_and_authorize_objects

  decorates_assigned :items, :item, :menu

  def index
    # If there's a menu, get items from that menu, otherwise get items from the organization
    @items = if @menu
               @menu.items
             else
               @organization.items
             end
  end

  def show
    # Show a single item (works for both organizations and menus)
    authorize! :read, @item
  end

  def new
    @item = @organization.items.build
  end

  def create
    @item = @organization.items.build(item_params)
    if @item.save
      redirect_to admin_organization_items_path(@organization), notice: 'Item created successfully.'
    else
      render :new
    end
  end

  def edit
    authorize! :update, @item
  end

  def update
    if @item.update(item_params)
      redirect_to admin_organization_items_path(@organization, @item), notice: 'Item updated successfully.'
    else
      render :edit
    end
  end

  def destroy
    @item.destroy
    redirect_to admin_organization_items_path(@organization), notice: 'Item deleted successfully.'
  end

  private

  def load_and_authorize_objects
    # If the action requires an item (e.g., show, edit, update, destroy), load it

    if params[:id].present?
      @item = Item.find(params[:id])
      authorize! :read, @item
    # First, try to load the organization based on organization_id
    elsif params[:organization_id].present?
      @organization = Organization.find(params[:organization_id])
      authorize! :read, @organization
    elsif params[:menu_id].present?
      # If menu_id is present, load the menu and its organization
      @menu = Menu.find(params[:menu_id])
      @organization = @menu.organization
      authorize! :read, @menu
    else
      redirect_to root_path, alert: 'Organization or Menu is required.'
    end


  end

  def item_params
    params.require(:item).permit(:name, :description, :price, :menu_id)
  end
end
