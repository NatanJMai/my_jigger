class Admin::DatasheetsController < AdminController
  before_action :set_datasheet, only: [:show, :edit, :update, :destroy, :calculate_cmv]
  before_action :set_item

  def index
    @datasheets = @item.datasheets
  end

  # GET /items/1 or /items/1.json
  def show
  end

  # GET /items/new
  def new
    @datasheet = @item.datasheets.new
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
    @datasheet = @item.datasheets.new(datasheet_params)

    respond_to do |format|
      if @datasheet.save
        format.html { redirect_to admin_item_datasheets_path(@item),
                                  notice: "Datasheet was successfully created." }
        format.json { render :show, status: :created, location: @datasheet }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @datasheet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @datasheet.update(datasheet_params)
        format.html { redirect_to admin_item_datasheets_path(@item),
                                  notice: "Datasheet was successfully updated." }

        format.json { render :show, status: :ok, location: @datasheet }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @datasheet.errors, status: :unprocessable_entity }
      end
    end
  end

  def calculate_cmv
    return 0 unless params[:customer_price].present?

    value = params[:customer_price].to_f
    return 0 unless value.positive?

    @cmv = @datasheet.calculate_cmv(value)

    respond_to do |format|
      format.json { render json: { cmv: @cmv.round(2) } }
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @datasheet.destroy

    respond_to do |format|
      format.html { redirect_to admin_item_datasheets_path(@item),
                                notice: "Item was successfully destroyed." }

      format.json { head :no_content }
    end
  end

  private

  def set_item
    if @datasheet.present?
      @item = @datasheet.item
    else
      @item = Item.find_by(id: params[:item_id])
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_datasheet
    @datasheet = Datasheet.find_by(id: params[:id])
  end

  # Only allow a list of trusted parameters through.
  def datasheet_params
    params.require(:datasheet).permit(:name, :item_id, :status)
  end
end
