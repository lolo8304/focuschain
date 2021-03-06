contract Car {
    
    enum LifeStates {
        Ordered,
        Produced,
        Supplied,
        Inuse,
        Dumped
    }

    
    // This is the current life stage of the car
    LifeStates public state = LifeStates.Ordered;
    
    uint public creationTime = now;
    address public producer;
    address public owner;
    address public holder;
    
    string public model;
    uint8 public price;
    uint8 public ccm;
    string public details;
    string public chassisNo;
    string public assemblyLine;
    
    string public insuranceId;
    string public policyNo;
    bool public matriculated = false;

    
    //Event Definitions
    event Ordered (
        address producer,
        address owner,
        string modell,
        uint8 ccm,
        uint8 price
        );
    
    event Produced (
        address producer,
        address owner,
        string chassisNo
        );
        
    event Supplied (
        address garage
        );
    
    event Delivered (
        address owner
        );
        
    event Matriculated (
        address owner,
        string insuranceId,
        string policyNo
        );
        
    event Exmatriculated (
        address owner,
        string policyNo
        );
        
    event Sold (
        address oldOwner,
        address newOwner
        );

    
    event Dumped (
        address owner
        );

		
    modifier atState(LifeStates _state) {
        if (state != _state) throw;
        _
    }
    modifier checkOwner() {
        if (owner != msg.sender) throw;
        _
    }
    
    modifier atSupplied() {
        if (uint(state) < 2) throw; //mindestns Supplied
        if (state == LifeStates.Dumped) throw;
        _
    }
   
    function nextState() internal {
        state = LifeStates(uint(state) + 1);
    }
    

    //executed as Garage
    function Car (string _model, uint8 _ccm, uint8 _price, string _details, address _producer, address _owner) {
        model = _model;
        ccm = _ccm;
        price = _price;
        details = _details;
        producer = _producer;
        owner = _owner;
        holder = msg.sender; //virtueller Holder ist Garage
        
        //Trigger Ordered Event
        Ordered (producer, owner, model, ccm, price);
    
    }

    //exectued as assepbly line
    function produce(string _chassisNo, string _assemblyLine)
    {
        if (state != LifeStates.Ordered) throw;
        chassisNo = _chassisNo;
        assemblyLine = _assemblyLine;
		holder = msg.sender;
        
        state = LifeStates.Produced;
        
        //Trigger Event Produced
        Produced(producer, owner, chassisNo);
    } 
    
    //executed as Garage
    function supply() 
    {
	    if (state != LifeStates.Produced) throw;
	    holder = msg.sender;
	
	    state = LifeStates.Supplied;
	    //Trigger Supplied Event
	    Supplied(msg.sender);
    } 

    //executed as StVa
    function matriculate(string _insuranceId, string _policyNo) 
        atSupplied
    {
		if (matriculated) throw; //bevor matriculiert wird, muss exmatriculiert werden
		insuranceId = _insuranceId;
        policyNo = _policyNo;
        matriculated = true;
        
        //Trigger Event
        Matriculated(owner, insuranceId, policyNo);
    } 
    
    function exmatriculate() 
        atSupplied
    {
        if (!matriculated) throw;
        var oldPolicyNo = policyNo;
        policyNo = "";
        matriculated = false;
        
        //Trigger Event
        Exmatriculated(owner, oldPolicyNo);
    } 
    
    // executed as the owner (customer)
    function deliver() 
        checkOwner
        atSupplied
    {
		state = LifeStates.Inuse;
		owner = msg.sender;
		holder = msg.sender;
		
		//Trigger Event
		Delivered(owner);
    } 
	
	// executed as the owner
	function sell(address _owner)
		checkOwner
		atSupplied
	{
		var oldOwner = owner;
		owner = _owner;
		holder = _owner;
		
		//Triffer Event
		Sold(oldOwner, owner);
	}		
    
    // executed as the owner
	function dump()
		checkOwner
		atSupplied
	{
	    if (matriculated) throw;
        state = LifeStates.Dumped;
		//Triffer Event
		Dumped(owner);
	}	
	
	


	
	
    function getState() returns (LifeStates)
    {
        return state;
    } 
    
    function () {
        // This function gets executed if a
        // transaction with invalid data is sent to
        // the contract or just ether without data.
        // We revert the send so that no-one
        // accidentally loses money when using the
        // contract.
        throw;
    }
   
}