class Admin::ItemsController < AdminController
  before_action :set_item, only: [:show, :edit, :update, :destroy]
  before_action :set_organization

  # GET /items or /items.json
  def index
    @items = @organization.items
  end

  # GET /items/1 or /items/1.json
  def show
  end

  # GET /items/new
  def new
    @item = @organization.items.new
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
    @item = @organization.items.new(item_params)

    respond_to do |format|
      if @item.save
        format.html { redirect_to admin_organization_items_path(@organization),
                                  notice: "Item was successfully created." }

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
        format.html { redirect_to admin_organization_items_path(@organization),
                                  notice: "Item was successfully updated." }

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
      format.html { redirect_to admin_organization_items_path(@organization),
                                notice: "Item was successfully destroyed." }

      format.json { head :no_content }
    end
  end

  private

    def set_organization
      if @item.present?
        @organization = @item.organization
      else
        @organization = Organization.find_by(id: params[:organization_id])
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    def item_params
      params.require(:item).permit(:name, :menu_section_id, :organization_id, :status)
    end
end
