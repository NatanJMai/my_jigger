class Admin::ItemsController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :menu
  load_and_authorize_resource :item, through: :menu
  load_and_authorize_resource :organization, through: :menu

  decorates_assigned :items, :item
  decorates_assigned :menu

  # GET /items or /items.json
  def index
    # @items = @category.items
    @organization = current_organization
  end

  # GET /items/1 or /items/1.json
  def show
    @menu = @item.menu
  end

  # GET /items/new
  def new
    @item = @menu.items.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items or /items.json
  def create
    @item = @menu.items.new(item_params)

    @item.datasheet.create(name: 'Datasheet 1')

    respond_to do |format|
      if @item.save
        format.html do
          redirect_to admin_menu_items_path(@menu),
                      notice: 'Item was successfully created.'
        end

        format.json { render :show, status: :created, location: @item }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @item.update(item_params)
        format.html do
          redirect_to admin_menu_items_path(@menu),
                      notice: 'Item was successfully updated.' end

        format.json { render :show, status: :ok, location: @item }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @item.destroy

    respond_to do |format|
      format.html do
        redirect_to admin_category_items_path(@category),
                    notice: 'Item was successfully destroyed.'
      end

      format.json { head :no_content }
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def item_params
    full_attributes = %i[name category_id status customer_price 
    customer_price_cents purchase_price purchase_price_cents]
    
    params.require(:item).permit(full_attributes)
  end
end
