//
//  Search.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Search : NSObject
@property(nonatomic,getter = isSubjectSet)BOOL subjectSet;
@property(nonatomic,getter = isCourseNumberSet)BOOL courseNumberSet;
@property(nonatomic,getter = isCourseNameSet)BOOL courseNameSet;
@property(nonatomic,getter = isAvailableSet)BOOL availableSet;
@property(nonatomic,strong)NSString * postString;
-(instancetype)initWithDictionary:(NSMutableDictionary *)dictionary;
@end
