# app/services/file_parser_service.rb
class FileParserService
  def initialize(file)
    @file = file
    @file_path = file&.file
  end

  ##
  # Return the records objects to be created in Worker
  # @return Object[]
  def parse(object_type = nil)
    if object_type == :menu
      name, result = MenuParserService.new(@file).parse
    elsif object_type == :item
      name, result = ItemParserService.new(@file).parse
    end

    [name, result]
  end
end
