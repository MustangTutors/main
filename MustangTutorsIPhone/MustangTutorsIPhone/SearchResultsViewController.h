//
//  SearchResultsViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TutorArray.h"
#import "Tutor.h"
@interface SearchResultsViewController : UIViewController <UITableViewDelegate,UITableViewDataSource>
@property(nonatomic,weak)IBOutlet UITableView * searchResultsTableView;
@property(nonatomic,strong)TutorArray * searchResults;
-(void)setExtraInitialStatesTableView:(Tutor *)tutor;

@end
